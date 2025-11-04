// src/components/PDFUploader.js
import React, { useState } from "react";

function PDFUploader({ onFilesSelected }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    onFilesSelected(selected);
  };

  return (
    <div style={{ padding: 20, border: "2px dashed #ccc", borderRadius: 10 }}>
      <h3>Upload your PDF files</h3>
      <input type="file" accept="application/pdf" multiple onChange={handleFileChange} />
      {files.length > 0 && (
        <ul>
          {files.map((f, i) => (
            <li key={i}>{f.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PDFUploader;