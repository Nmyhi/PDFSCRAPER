import React, { useState } from "react";
import PDFUploader from "./components/PDFUploader";
import { extractTextFromPDF } from "./utils/pdfToText";
import { parseProductData } from "./utils/parseProductData";
import { generateExcelFromPDFs } from "./utils/pdfToExcel";

function App() {
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files, onProgress) => {
    setLoading(true);

    const extracted = [];

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];

        try {
          const text = await extractTextFromPDF(file);
          const fields = parseProductData(text, file.name);

          extracted.push({
            filename: file.name.replace(/\.pdf$/i, ""),
            fields,
          });
        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error);
        }

        // Update progress after each file finishes
        onProgress?.(index + 1);

        // Allow React to repaint the progress indicator
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      generateExcelFromPDFs(extracted);
    } catch (error) {
      console.error("PDF processing failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      padding: 20,
      textAlign: "center",
      background: "#0c0c0c",
      cursor: "none",
    },

    header: {
      width: "100%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: 30,
      background: "#0c0c0c",
      cursor: "none",
    },

    titleImage: {
      width: "280px",
      maxWidth: "90%",
      height: "auto",
      objectFit: "contain",
      marginLeft: "-10px",
      filter: "drop-shadow(0 0 18px rgba(255,255,255,0.2))",
      cursor: "none",
    },

    loading: {
      marginTop: 20,
      color: "#0c0c0c",
      fontSize: 16,
      cursor: "none",
    },
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