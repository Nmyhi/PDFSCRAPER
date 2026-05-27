// src/components/PDFUploader.js
import React, { useEffect, useRef, useState } from "react";

function PDFUploader({ onFilesSelected }) {
  const [files, setFiles] = useState([]);
  const [particles, setParticles] = useState([]);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  const [mouseGlow, setMouseGlow] = useState({
    x: -100,
    y: -100
  });

  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animationRef = useRef(null);

  useEffect(() => {
    const emojis = ["💡", "🔦", "✨", "🔆", "🔅", "🕯️", "☀️", "⚡", "⚙️", "🔥"];

    const createdParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -Math.random() * window.innerHeight,
      baseVx: 0.9 + Math.random() * 1.8,
      baseVy: 3.2 + Math.random() * 3.8,
      vx: 0.9 + Math.random() * 1.8,
      vy: 3.2 + Math.random() * 3.8,
      size: 18 + Math.random() * 28,
      opacity: 0.3 + Math.random() * 0.55,
      rotation: Math.random() * 360,
      spin: -2 + Math.random() * 4,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));

    setParticles(createdParticles);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      setMouseGlow({
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };

      setMouseGlow({
        x: -100,
        y: -100
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      setParticles((prev) =>
        prev.map((p) => {
          let { x, y, vx, vy, rotation } = p;

          x += vx;
          y += vy;
          rotation += p.spin;

          const dx = x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const radius = 90;

          if (distance < radius) {
            const force = (radius - distance) / radius;
            const angle = Math.atan2(dy, dx);

            vx += Math.cos(angle) * force * 1.8;
            vy += Math.sin(angle) * force * 1.8;
          }

          vx *= 0.96;
          vy *= 0.96;

          vx += p.baseVx * 0.04;
          vy += p.baseVy * 0.04;

          if (y > window.innerHeight + 80 || x > window.innerWidth + 80) {
            x = Math.random() * window.innerWidth - 100;
            y = -80 - Math.random() * 200;

            const newBaseVx = 0.9 + Math.random() * 1.8;
            const newBaseVy = 3.2 + Math.random() * 3.8;

            p.baseVx = newBaseVx;
            p.baseVy = newBaseVy;

            vx = newBaseVx;
            vy = newBaseVy;
          }

          if (x < -120) {
            x = Math.random() * window.innerWidth;
          }

          return {
            ...p,
            x,
            y,
            vx,
            vy,
            rotation
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
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
      <div
        style={{
          ...styles.cursorGlow,
          ...(isHoveringButton ? styles.cursorGlowActive : {}),
          left: mouseGlow.x,
          top: mouseGlow.y
        }}
      >
        💡
      </div>

      <div style={styles.background}>
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              ...styles.bulb,
              left: 0,
              top: 0,
              fontSize: `${p.size}px`,
              opacity: p.opacity,
              transform: `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      <div style={styles.overlay} />

      <div style={styles.container}>
        <h2 style={styles.title}>PDF Scraper</h2>

        <div style={styles.buttonRow}>
          <label
            style={styles.button}
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
          >
            📄 Select PDF Files
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
              style={styles.hiddenInput}
            />
          </label>

          <label
            style={styles.button}
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
          >
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

          <button
            style={styles.clearButton}
            onClick={clearFiles}
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
          >
            ❌ Clear
          </button>

          <button
            style={{
              ...styles.scrapeButton,
              opacity: files.length === 0 ? 0.6 : 1
            }}
            onClick={handleScrape}
            disabled={files.length === 0}
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
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
    cursor: "none",
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

  cursorGlow: {
    position: "fixed",
    width: 42,
    height: 42,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    transform: "translate(-50%, -50%)",

    fontSize: 26,

    pointerEvents: "none",
    zIndex: 9999,

    filter: `
      drop-shadow(0 0 6px rgba(255, 230, 90, 0.95))
      drop-shadow(0 0 14px rgba(255, 210, 70, 0.8))
      drop-shadow(0 0 24px rgba(255, 190, 40, 0.45))
    `,

    transition: "transform 0.03s linear"
  },

  cursorGlowActive: {
    filter: `
      drop-shadow(0 0 6px rgba(255, 80, 80, 1))
      drop-shadow(0 0 14px rgba(239, 68, 68, 0.9))
      drop-shadow(0 0 28px rgba(220, 38, 38, 0.6))
    `
  },

  bulb: {
    position: "absolute",
    userSelect: "none",
    willChange: "transform",
    filter: "drop-shadow(0 0 8px rgba(255, 220, 100, 0.45))"
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.05)",
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
    cursor: "none",
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
    cursor: "none",
    border: "none",
    fontWeight: 500,
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)"
  },

  scrapeButton: {
    padding: "10px 18px",
    background: "#16a34a",
    color: "white",
    borderRadius: 8,
    cursor: "none",
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