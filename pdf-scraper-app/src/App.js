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

    header: {
      width: "100%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: 30
    },

    titleImage: {
      width: "280px",
      maxWidth: "90%",
      height: "auto",
      objectFit: "contain",
      marginLeft: "-10px",
      filter: "drop-shadow(0 0 18px rgba(255,255,255,0.2))"
    },

    loading: {
      marginTop: 20,
      color: "#e5e7eb",
      fontSize: 16
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <img
          src="/phos-title.png"
          alt="PHOS Photometric PDF Excel Extractor"
          style={styles.titleImage}
        />
      </header>

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