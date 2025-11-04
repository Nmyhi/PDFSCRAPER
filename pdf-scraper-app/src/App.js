import React, { useState } from "react";
import PDFUploader from "./components/PDFUploader";
import { extractTextFromPDF } from "./utils/pdfToText";
import { generateExcelFromPDFs } from "./utils/pdfToExcel";

function App() {
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files) => {
    setLoading(true);
    const extracted = [];

    for (const file of files) {
      const text = await extractTextFromPDF(file);
      extracted.push({ filename: file.name.replace(".pdf", ""), text });
    }

    generateExcelFromPDFs(extracted);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📄 PDF Scraper to Excel</h2>
      <PDFUploader onFilesSelected={handleFiles} />
      {loading && <p>Extracting text... please wait ⏳</p>}
    </div>
  );
}

export default App;