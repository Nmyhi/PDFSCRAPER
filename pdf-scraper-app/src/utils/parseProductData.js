// src/utils/parseProductData.js

// Helper: extract text value or empty string
const getValue = (text, pattern) => {
  const match = text.match(pattern);
  return match ? match[1].trim() : "";
};

// Helper: remove units like "W", "lm", "cd", "K", "°", "V", "A", etc.
const normalize = (val) => {
  if (!val) return "";
  return val
    .replace(/,/g, ".")        // commas → dots
    .replace(/[^\d.\-]/g, "")  // keep only numbers, dot, minus
    .trim();
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
  getValue(
    text,
    /([0-9]{1,3}[.,][0-9]{1,2})\s*°/
  ) ||
  "";



  return {
    family,
    subfamily: "",
    LightEngine: "",

    power: normalize(getValue(text, /Power:\s*([\d.,]+\s*\w+)/i)) || powerFromName,
    colourTemp: normalize(getValue(text, /Color temperature:\s*([\d.,]+\s*\w*)/i)) || colourTempFromName,
    CRI: normalize(getValue(text, /CRI[:\s]+([\d.,]+)/i)),
    BeamAngle: normalize(beamAngleMeasured), // ✅ measured angle only

    DriverCurrent: normalize(getValue(text, /Current:\s*([\d.,]+\s*A)/i)),
    LuminaireLumens: normalize(getValue(text, /Output:\s*([\d.,]+\s*\w+)/i)),
    CircuitWatts: normalize(getValue(text, /Power:\s*([\d.,]+\s*\w+)/i)),
    LuminaireEfficacy: normalize(getValue(text, /Light efficiency:\s*([\d.,]+\s*\w+)/i)),
    Candelas: normalize(getValue(text, /Peak:\s*([\d.,]+\s*\w+)/i)),

    Binning: "",
    CRI_2: normalize(getValue(text, /CRI[:\s]+([\d.,]+)/i)),
    TM30_RF: normalize(getValue(text, /TM[-\s]?30\s*[:\-]?\s*([\d.,]+)/i)) || normalize(getValue(text, /\bRf\b[^\d]*([\d.,]+)/i)),
    TM30_RG: normalize(getValue(text, /\bRg\b[^\d]*([\d.,]+)/i)) || normalize(getValue(text, /TM[-\s]?30[^\n]*\bRg\b[^\d]*([\d.,]+)/i)),

    LumenMaintenance: "",
    Lifetime: "",
    ForwardVoltage: normalize(getValue(text, /Voltage:\s*([\d.,]+\s*\w*)/i)),
    Current: normalize(getValue(text, /Current:\s*([\d.,]+\s*\w*)/i)),
    IPRating: "",
    IKRating: "",
    Warranty: "",
    FireRated: "",
    AcousticRated: "",
    Tube: "",
    Cable: "",
    EngineLmW: normalize(getValue(text, /Light efficiency:\s*([\d.,]+\s*\w+)/i)),
    SourceLmW: "",
    Length: "",
    PowerFactor: normalize(getValue(text, /PF:\s*([\d.,]+)/i)),
  };
};
