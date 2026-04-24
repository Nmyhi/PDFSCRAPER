// src/components/PDFUploader.js
import React, { useMemo, useState } from "react";

function PDFUploader({ onFilesSelected }) {
  const [files, setFiles] = useState([]);

  const bulbs = useMemo(() => {
    const emojis = ["💡", "🔦", "✨", "🔆", "🔅", "🕯️", "☀️", "⚡","⚙️","🔥"];

    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: -15 + Math.random() * 130,
      top: -20 - Math.random() * 80,
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 6,
      size: 20 + Math.random() * 28,
      opacity: 0.25 + Math.random() * 0.5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
  }, []);

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
    <div style={styles.page}>
      <div style={styles.background}>
        {bulbs.map((bulb) => (
          <div
            key={bulb.id}
            style={{
              ...styles.bulb,
              left: `${bulb.left}vw`,
              top: `${bulb.top}vh`,
              animationDelay: `${bulb.delay}s`,
              animationDuration: `${bulb.duration}s`,
              fontSize: `${bulb.size}px`,
              opacity: bulb.opacity
            }}
          >
            {bulb.emoji}
          </div>
        ))}
      </div>

      <div style={styles.overlay} />

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

      <style>
        {`
          @keyframes fallDiagonal {
            0% {
              transform: translate3d(0, 0, 0) rotate(0deg);
            }
            100% {
              transform: translate3d(35vw, 130vh, 0) rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

export default PDFUploader;

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    padding: 24,
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #334155 100%)",
    fontFamily: "sans-serif"
  },

  background: {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: 0
  },

  bulb: {
    position: "absolute",
    userSelect: "none",
    animationName: "fallDiagonal",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    willChange: "transform",
    filter: "drop-shadow(0 0 12px rgba(255, 220, 100, 0.6))"
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.08)",
    zIndex: 1,
    pointerEvents: "none"
  },

  container: {
    position: "relative",
    zIndex: 2,
    padding: 30,
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 16,
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    maxWidth: 700,
    width: "100%",
    margin: "auto",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)"
  },

  title: {
    marginBottom: 20,
    color: "#111827",
    fontSize: 28
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
    border: "none",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)"
  },

  clearButton: {
    padding: "10px 18px",
    background: "#ef4444",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
    border: "none",
    fontWeight: 500,
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)"
  },

  scrapeButton: {
    padding: "10px 18px",
    background: "#16a34a",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
    border: "none",
    fontWeight: 600,
    fontSize: 15,
    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)"
  },

  fileBox: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: 8,
    padding: 15,
    border: "1px solid #e5e5e5",
    maxHeight: 300,
    overflowY: "auto"
  },

  fileCount: {
    marginBottom: 10,
    fontWeight: 600,
    color: "#111827"
  },

  fileList: {
    paddingLeft: 20,
    margin: 0
  },

  fileItem: {
    marginBottom: 4,
    color: "#374151"
  }
};