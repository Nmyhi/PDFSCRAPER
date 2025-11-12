// src/utils/parseProductData.js

// Helper: extract text value or empty string
const getValue = (text, pattern) => {
  const match = text.match(pattern);
  return match ? match[1].trim() : "";
};

// Helper: normalize numeric strings safely (handles 1,250 vs 1.250,5, strips units)
const normalize = (val) => {
  if (!val) return "";
  const s = String(val).trim();

  // If both separators present, treat comma as decimal and dot as thousands: 1.234,5 -> 1234.5
  if (s.includes(".") && s.includes(",")) {
    return s.replace(/\./g, "").replace(",", ".").replace(/[^\d.\-]/g, "");
  }

  // If only comma present, decide whether it's thousands or decimal:
  if (s.includes(",")) {
    const parts = s.split(",");
    // If exactly one comma and 3 digits follow -> thousands separator: 1,250 -> 1250
    if (parts.length === 2 && parts[1].length === 3) {
      return s.replace(/,/g, "").replace(/[^\d.\-]/g, "");
    }
    // Else treat comma as decimal: 12,5 -> 12.5
    return s.replace(/,/g, ".").replace(/[^\d.\-]/g, "");
  }

  // Otherwise: just strip non-numeric (except dot and minus)
  return s.replace(/[^\d.\-]/g, "");
};

export const parseProductData = (text, filename = "") => {
  // Split filename into words
  const nameParts = filename.replace(/\.[^/.]+$/, "").split(/\s+/);
  const family = nameParts[0] || "";
  const subfamily = nameParts[1] || "";

  // Extract Power (e.g. "1W", "2.7W", "15W") and Colour Temp (e.g. "27K", "3000K", "40K") from filename
  const powerFromName =
    filename.match(/(\d+(?:\.\d+)?)\s*[wW]/)?.[1] || "";
  const colourTempFromName =
    filename.match(/(\d{2,4})\s*[kK]/)?.[1] || "";
  const beamAngleFromName =
  normalize(
    filename
      .match(/(\d{1,3}(?:[.,]\d{1,2})?)\s*(?:°|deg)?/i)?.[1] || ""
  );

  // ✅ Beam angle printed under the diagram: single degree with decimal on its own line
  let beamAngleMeasured =
    // 1) A standalone "xx.x°" on its own line (most reliable for the diagram caption)
    getValue(
      text,
      /(?:^|\r?\n)\s*([0-9]{1,3}[.,][0-9]{1,2})\s*°\s*(?:\r?\n|$)/m
    ) ||
    // 2) Within common diagram sections ("Iso", "Beam", etc.) then a standalone degree on a near line
    getValue(
      text,
      /(Iso[\s-]*candela|Iso[\s-]*lux|Iso\s*Diagrams|Beam\s*details|Beam\s*center)[\s\S]{0,500}?\r?\n\s*([0-9]{1,3}[.,][0-9]{1,2})\s*°/i
    ) ||
    // 3) Fallback: first decimal degree anywhere (avoids 90/60/45 axis labels)
    getValue(text, /([0-9]{1,3}[.,][0-9]{1,2})\s*°/) ||
    "";
    console.log("---- RAW TEXT SAMPLE ----");
console.log(text.slice(0, 2000)); // print the first 2000 characters
  return {
    // --- from filename ---
    family,
    subfamily,
    LightEngine: "please fill",

    // --- Power from filename ---
    power: normalize(powerFromName),

    // --- Colour temperature from filename ---
    colourTemp: normalize(colourTempFromName),

    // --- BeamAngle from filename ---
    BeamAngleFileName: normalize(beamAngleFromName),

    // --- from PDF text ---
    CRI: normalize(getValue(text, /CRI[:\s]+([\d.,]+)/i)),
    BeamAngle: normalize(beamAngleMeasured),
    DriverCurrent: "please fill",

    LuminaireLumens: normalize(
      getValue(text, /\bOutput\b\s*:?\s*([0-9]{1,6}(?:[.,][0-9]{1,2})?)\s*[lL][mM]\b/) ||
      getValue(text, /\bOutput\b\s*:?\s*[\s\S]{0,60}?([0-9]{1,6}(?:[.,][0-9]{1,2})?)\s*[lL][mM]\b/)
    ),

    CircuitWatts: normalize(
      getValue(text, /\bPower\b\s*:?\s*([0-9]{1,3}(?:[.,][0-9]{1,3})?)\s*[Ww]\b/i) ||
      getValue(text, /\bPower\b\s*:?\s*[\s\S]{0,60}?([0-9]{1,3}(?:[.,][0-9]{1,3})?)\s*[Ww]\b/i)
    ),

    LuminaireEfficacy: normalize(getValue(text, /Light efficiency:\s*([\d.,]+\s*\w+)/i)),

    // ✅ Candela value from PDF summary box
    Candelas: normalize(
      getValue(
        text,
        /\bPeak(?:\s+intensity)?\b\s*:?\s*[\s\S]{0,200}?([0-9]{1,6}(?:[.,][0-9]{1,2})?)\s*(?:cd|candelas?)\b/i
      )
    ),

    Binning: "2",
    CRI_2: normalize(getValue(text, /CRI[:\s]+([\d.,]+)/i)),
    TM30_RF: normalize(
  // From the TM-30 table block: capture the 4th numeric on the next line (Rf)
  getValue(
    text,
    /CCT\s+CRI\s+CRI\s+R9\s+TM30\s*Rf\s+TM30\s*Rg[\s\S]{0,120}?\n\s*[0-9.,]+\s*K?\s+[0-9.,]+\s+[0-9.,]+\s+([0-9]{1,3}(?:[.,][0-9]{1,2})?)/i
  )
  // Caption fallback: require "Fidelity index Rf" nearby to avoid axis ticks
  || getValue(
    text,
    /\bRf\b[^\d]{0,5}([0-9]{1,3}(?:[.,][0-9]{1,2})?)[^\n\r]{0,80}\bFidelity\s+index\s+Rf\b/i
  )
),

TM30_RG: normalize(
  // From the TM-30 table block: capture the 5th numeric on the next line (Rg)
  getValue(
    text,
    /CCT\s+CRI\s+CRI\s+R9\s+TM30\s*Rf\s+TM30\s*Rg[\s\S]{0,120}?\n\s*[0-9.,]+\s*K?\s+[0-9.,]+\s+[0-9.,]+\s+[0-9.,]+\s+([0-9]{1,3}(?:[.,][0-9]{1,2})?)/i
  )
  // Caption fallback: require "Gamut index Rg" nearby to avoid axis ticks
  || getValue(
    text,
    /\bRg\b[^\d]{0,5}([0-9]{1,3}(?:[.,][0-9]{1,2})?)[^\n\r]{0,80}\bGamut\s+index\s+Rg\b/i
  )
),




    LumenMaintenance: "LM80",
    Lifetime: "50000",
    ForwardVoltage: "please fill",
    Current: "please fill",

    IPRating: "please fill",
    IKRating: "please fill",
    Warranty: "5 years",
    FireRated: "please fill",
    AcousticRated: "please fill",
    Tube: "please fill",
    Cable: "please fill",
    EngineLmW: "please fill",
    SourceLmW: "please fill",
    Length: "please fill",
    PowerFactor: normalize(
  // PF: ... (skip numbers that have lm/cd/W), then take 0.xxx or 1.00
  getValue(
    text,
    /\bPF\b\s*:?\s*(?:[^0-9]*(?:\d+(?:[.,]\d+)?\s*(?:lm|cd|[Ww])\b))*[^0-9]*((?:0(?:[.,]\d{1,3})?|1(?:[.,]0{1,3})?))\b(?!\s*(?:lm|cd|[Ww])\b)/i
  )
  ||
  // Power factor: ... (same logic)
  getValue(
    text,
    /\bPower\s*factor\b\s*:?\s*(?:[^0-9]*(?:\d+(?:[.,]\d+)?\s*(?:lm|cd|[Ww])\b))*[^0-9]*((?:0(?:[.,]\d{1,3})?|1(?:[.,]0{1,3})?))\b(?!\s*(?:lm|cd|[Ww])\b)/i
  )
),
  };
};
