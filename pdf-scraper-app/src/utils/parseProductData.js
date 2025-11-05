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
  const family = filename.split(" ")[0] || "";
  const powerFromName = filename.match(/(\d+\.?\d*)\s*[wW]/)?.[1] || "";
  const colourTempFromName = filename.match(/(\d{3,4})\s*[kK]/)?.[1] || "";

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

  return {
    family,
    subfamily: "",
    LightEngine: "",

    // ✅ Power: read ONLY from the "Power:" label (allowing line breaks/odd spacing)
    power: "from filename",

    colourTemp: "from filename",
    CRI: normalize(getValue(text, /CRI[:\s]+([\d.,]+)/i)),
    BeamAngle: normalize(beamAngleMeasured), // measured angle only

    DriverCurrent: normalize(getValue(text, /Current:\s*([\d.,]+\s*A)/i)),

    LuminaireLumens: normalize(
      // direct match after "Output:"
      getValue(text, /\bOutput\b\s*:?\s*([0-9]{1,6}(?:[.,][0-9]{1,2})?)\s*[lL][mM]\b/) ||
      // allow a short window in case of line breaks/odd spacing
      getValue(text, /\bOutput\b\s*:?\s*[\s\S]{0,60}?([0-9]{1,6}(?:[.,][0-9]{1,2})?)\s*[lL][mM]\b/)
    ),

    CircuitWatts: normalize(
      getValue(text, /\bPower\b\s*:?\s*([0-9]{1,3}(?:[.,][0-9]{1,3})?)\s*[Ww]\b/i) ||
      getValue(text, /\bPower\b\s*:?\s*[\s\S]{0,60}?([0-9]{1,3}(?:[.,][0-9]{1,3})?)\s*[Ww]\b/i)
    ),
    LuminaireEfficacy: normalize(getValue(text, /Light efficiency:\s*([\d.,]+\s*\w+)/i)),

    Candelas: normalize(
  getValue(
    text,
    /\bPeak(?:\s+intensity)?\b\s*:?\s*[\s\S]{0,200}?([0-9]{1,6}(?:[.,][0-9]{1,2})?)\s*(?:cd|candelas?)\b/i
  )
),





    Binning: "2",
    CRI_2: normalize(getValue(text, /CRI[:\s]+([\d.,]+)/i)),
    TM30_RF: "TM RF value in pdf",
    TM30_RG: "TM RG value in PDF",

    LumenMaintenance: "LM80",
    Lifetime: "50000",
    ForwardVoltage: normalize(getValue(text, /Voltage:\s*([\d.,]+\s*\w*)/i)),
    Current: normalize(getValue(text, /Current:\s*([\d.,]+\s*\w*)/i)),
    IPRating: "please fill manually",
    IKRating: "please fill manually",
    Warranty: "5 years",
    FireRated: "please fill manually",
    AcousticRated: "please fill manually",
    Tube: "please fill manually",
    Cable: "please fill manually",
    EngineLmW: "please fill manually",
    SourceLmW: "please fill manually",
    Length: "please fill manually",
    PowerFactor: "PF value in the PDF",
  };
};
