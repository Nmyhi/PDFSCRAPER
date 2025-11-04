import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const generateExcelFromPDFs = (dataArray) => {
  const workbook = XLSX.utils.book_new();

  const rows = dataArray.map((data) => ({
    "File Name": data.filename,
    "family": data.fields.family,
    "subfamily": data.fields.subfamily,
    "Light Engine": data.fields.LightEngine,
    "power": data.fields.power,
    "colour temp": data.fields.colourTemp,
    "CRI": data.fields.CRI,
    "Beam Angle": data.fields.BeamAngle,
    "Driver Current": data.fields.DriverCurrent,
    "Luminaire lumens": data.fields.LuminaireLumens,
    "Circuit Watts": data.fields.CircuitWatts,
    "Luminaire Efficacy": data.fields.LuminaireEfficacy,
    "Candela's": data.fields.Candelas,
    "Binning": data.fields.Binning,
    "CRI (2)": data.fields.CRI_2,
    "TM-30-15 RF": data.fields.TM30_RF,
    "TM-30-15 RG": data.fields.TM30_RG,
    "Lumen maintenance": data.fields.LumenMaintenance,
    "Lifetime": data.fields.Lifetime,
    "Forward Voltage": data.fields.ForwardVoltage,
    "Current": data.fields.Current,
    "IP Rating": data.fields.IPRating,
    "IK Rating": data.fields.IKRating,
    "Warranty": data.fields.Warranty,
    "Fire Rated": data.fields.FireRated,
    "Acoustic Rated": data.fields.AcousticRated,
    "Tube": data.fields.Tube,
    "Cable": data.fields.Cable,
    "Engine Lm/W": data.fields.EngineLmW,
    "Source Lm/W": data.fields.SourceLmW,
    "Length": data.fields.Length,
    "Power Factor": data.fields.PowerFactor,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Product Data");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "Extracted_Products.xlsx");
};
