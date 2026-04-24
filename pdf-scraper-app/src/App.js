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

  const styles = {
  page: {
    padding: 20,
    textAlign: "center"
  },

  title: {
    fontSize: "clamp(28px, 4vw, 48px)",
    fontWeight: 800,
    marginBottom: 30,
    letterSpacing: "-0.5px",

    background: "linear-gradient(90deg, #050505, #e98d71, #f33e07)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",

    textAlign: "center",
    textShadow: "0 4px 20px rgba(0,0,0,0.25)"
  },

  loading: {
    marginTop: 20,
    color: "#e5e7eb",
    fontSize: 16
  }
};

  return (
  <div style={styles.page}>
    <h1 style={styles.title}>
      PHOS Photometric PDF Excel Extractor
    </h1>

    <PDFUploader onFilesSelected={handleFiles} />

    {loading && (
      <p style={styles.loading}>
        Extracting data... please wait ⏳
      </p>
    )}
  </div>
);
}

export default App;
