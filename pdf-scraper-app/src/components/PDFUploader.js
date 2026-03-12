// src/components/PDFUploader.js
import React, { useState } from "react";

function PDFUploader({ onFilesSelected }) {
  const [files, setFiles] = useState([]);

  const mergePdfFiles = (incomingFiles) => {
    const pdfsOnly = incomingFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    setFiles((prev) => {
      const map = new Map();

      [...prev, ...pdfsOnly].forEach((file) => {
        const key = file.webkitRelativePath || `${file.name}-${file.size}`;
        map.set(key, file);
      });

      return Array.from(map.values());
    });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    mergePdfFiles(selected);
    e.target.value = "";
  };

  const handleFolderChange = (e) => {
    const selected = Array.from(e.target.files || []);
    mergePdfFiles(selected);
    e.target.value = "";
  };

  const handleScrape = () => {
    onFilesSelected(files);
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>PDF Scraper</h2>

      <div style={styles.buttonRow}>

        <label style={styles.button}>
          📄 Select PDF Files
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            style={styles.hiddenInput}
          />
        </label>

        <label style={styles.button}>
          📁 Select Folder
          <input
            type="file"
            accept="application/pdf"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFolderChange}
            style={styles.hiddenInput}
          />
        </label>

        <button style={styles.clearButton} onClick={clearFiles}>
          ❌ Clear
        </button>

        <button
          style={{
            ...styles.scrapeButton,
            opacity: files.length === 0 ? 0.6 : 1
          }}
          onClick={handleScrape}
          disabled={files.length === 0}
        >
          🥄 Scrape & Export Excel
        </button>

      </div>

      {files.length > 0 && (
        <div style={styles.fileBox}>
          <p style={styles.fileCount}>{files.length} PDF files selected</p>

          <ul style={styles.fileList}>
            {files.map((f, i) => (
              <li key={i} style={styles.fileItem}>
                {f.webkitRelativePath || f.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PDFUploader;


const styles = {

  container: {
    padding: 30,
    border: "2px dashed #dcdcdc",
    borderRadius: 12,
    background: "#fafafa",
    maxWidth: 700,
    margin: "auto",
    fontFamily: "sans-serif"
  },

  title: {
    marginBottom: 20
  },

  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20
  },

  hiddenInput: {
    display: "none"
  },

  button: {
    padding: "10px 18px",
    background: "#4f46e5",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
    transition: "0.2s",
    border: "none"
  },

  clearButton: {
    padding: "10px 18px",
    background: "#ef4444",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
    border: "none",
    fontWeight: 500
  },

  scrapeButton: {
    padding: "10px 18px",
    background: "#16a34a",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
    border: "none",
    fontWeight: 600,
    fontSize: 15
  },

  fileBox: {
    background: "white",
    borderRadius: 8,
    padding: 15,
    border: "1px solid #e5e5e5",
    maxHeight: 300,
    overflowY: "auto"
  },

  fileCount: {
    marginBottom: 10,
    fontWeight: 500
  },

  fileList: {
    paddingLeft: 20,
    margin: 0
  },

  fileItem: {
    marginBottom: 4
  }
};