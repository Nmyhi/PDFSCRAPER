// src/utils/parseProductData.js

export const parseProductData = (text, filename = "") => {
  const getValue = (pattern) => {
    const match = text.match(pattern);
    return match ? match[1].trim() : "";
  };

  // Derive from filename e.g. "Eyeconic 10° (4W 27K).pdf"
  const nameParts = filename.replace(".pdf", "").split(" ");
  const family = nameParts[0] || "";
  const beamAngleFromName = filename.match(/(\d+°)/i)?.[1] || "";
  const powerFromName = filename.match(/(\d+\.?\d*)\s*[wW]/)?.[1] ? `${filename.match(/(\d+\.?\d*)\s*[wW]/)[1]} W` : "";
  const colourTempFromName = filename.match(/(\d{2,4}K)/i)?.[1] || "";

  return {
    family,
    subfamily: "",
    LightEngine: getValue(/Driver:\s*([^\n]+)/i),
    power: getValue(/Power:\s*([\d.,]+\s*\w+)/i) || powerFromName,
    colourTemp: getValue(/Color temperature:\s*([\d.,]+\s*\w*)/i) || colourTempFromName,
    CRI: getValue(/CRI[:\s]+([\d.,]+)/i),
    BeamAngle: getValue(/Beam angle\s*\d*%?\s*([\d.,°]+)/i) || beamAngleFromName,
    DriverCurrent: getValue(/Current:\s*([\d.,]+\s*A)/i),
    LuminaireLumens: getValue(/Output:\s*([\d.,]+\s*\w+)/i),
    CircuitWatts: getValue(/Power:\s*([\d.,]+\s*\w+)/i),
    LuminaireEfficacy: getValue(/Light efficiency:\s*([\d.,]+\s*\w+)/i),
    Candelas: getValue(/Peak:\s*([\d.,]+\s*\w+)/i),
    Binning: "",
    CRI_2: getValue(/CRI[:\s]+([\d.,]+)/i),
    TM30_RF: getValue(/TM-30[:\s]+([\d.,]+)/i),
    TM30_RG: getValue(/RG[:\s]+([\d.,]+)/i),
    LumenMaintenance: "",
    Lifetime: "",
    ForwardVoltage: getValue(/Voltage:\s*([\d.,]+\s*\w*)/i),
    Current: getValue(/Current:\s*([\d.,]+\s*\w*)/i),
    IPRating: "",
    IKRating: "",
    Warranty: "",
    FireRated: "",
    AcousticRated: "",
    Tube: "",
    Cable: "",
    EngineLmW: getValue(/Light efficiency:\s*([\d.,]+\s*\w+)/i),
    SourceLmW: "",
    Length: "",
    PowerFactor: getValue(/PF:\s*([\d.,]+)/i),
  };
};
