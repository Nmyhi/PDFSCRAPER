// src/utils/pdfToExcel.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const generateExcelFromPDFs = (pdfDataArray) => {
  const workbook = XLSX.utils.book_new();

  pdfDataArray.forEach(({ filename, text }) => {
    // Split text by lines
    const lines = text.split(/\r?\n/).map((line) => [line]);
    const worksheet = XLSX.utils.aoa_to_sheet(lines);
    XLSX.utils.book_append_sheet(workbook, worksheet, filename.slice(0, 30));
  });

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "extracted_data.xlsx");
};
