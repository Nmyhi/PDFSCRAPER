import React, { useState } from "react";
import PDFUploader from "./components/PDFUploader";
import { extractTextFromPDF } from "./utils/pdfToText";
import { parseProductData } from "./utils/parseProductData";
import { generateExcelFromPDFs } from "./utils/pdfToExcel";

function App() {
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files) => {
    setLoading(true);
    const extracted = [];

    for (const file of files) {
      const text = await extractTextFromPDF(file);
      const fields = parseProductData(text, file.name);
      extracted.push({ filename: file.name.replace(".pdf", ""), fields });
    }

    generateExcelFromPDFs(extracted);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📄 PHOS PDF → Excel Extractor</h2>
      <PDFUploader onFilesSelected={handleFiles} />
      {loading && <p>Extracting data... please wait ⏳</p>}
    </div>
  );
}

export default App;
