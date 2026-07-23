// src/components/PDFUploader.js

import React, { useEffect, useRef, useState } from "react";

function PDFUploader({ onFilesSelected }) {
  const [files, setFiles] = useState([]);
  const [particles, setParticles] = useState([]);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  const [mouseGlow, setMouseGlow] = useState({
    x: -100,
    y: -100,
  });

  const [smellTrail, setSmellTrail] = useState([]);

  const smellIdRef = useRef(0);
  const lastSmellTimeRef = useRef(0);

  const mouseRef = useRef({
    x: -9999,
    y: -9999,
  });

  const animationRef = useRef(null);

  useEffect(() => {
    const styleElement = document.createElement("style");

    styleElement.textContent = `
      @keyframes smellFade {
        0% {
          opacity: 0.85;
          transform:
            translate(-50%, -50%)
            scale(0.45)
            rotate(var(--rotation));
        }

        100% {
          opacity: 0;
          transform:
            translate(
              calc(-50% + var(--drift-x)),
              calc(-50% + var(--drift-y))
            )
            scale(2.3)
            rotate(calc(var(--rotation) + 80deg));
        }
      }

      @keyframes flyOrbitOne {
        0% {
          transform: translate(-18px, -10px);
        }

        25% {
          transform: translate(8px, -22px);
        }

        50% {
          transform: translate(20px, 3px);
        }

        75% {
          transform: translate(-5px, 18px);
        }

        100% {
          transform: translate(-18px, -10px);
        }
      }

      @keyframes flyOrbitTwo {
        0% {
          transform: translate(16px, -12px);
        }

        25% {
          transform: translate(22px, 12px);
        }

        50% {
          transform: translate(-4px, 22px);
        }

        75% {
          transform: translate(-22px, -3px);
        }

        100% {
          transform: translate(16px, -12px);
        }
      }

      @keyframes flyOrbitThree {
        0% {
          transform: translate(-4px, -24px);
        }

        25% {
          transform: translate(23px, -4px);
        }

        50% {
          transform: translate(4px, 20px);
        }

        75% {
          transform: translate(-20px, 8px);
        }

        100% {
          transform: translate(-4px, -24px);
        }
      }
    `;

    document.head.appendChild(styleElement);

    const emojis = [
      "💡",
      "🔦",
      "✨",
      "🔆",
      "🔅",
      "🕯️",
      "☀️",
      "⚡",
      "⚙️",
      "🔥",
      "🚨",
      "🔭",
      "📏",
    ];

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
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));

    setParticles(createdParticles);

    const handleMouseMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;

      mouseRef.current = { x, y };

      setMouseGlow({ x, y });

      const now = Date.now();

      if (now - lastSmellTimeRef.current > 35) {
        lastSmellTimeRef.current = now;

        const newPuff = {
          id: smellIdRef.current++,
          x: x - 8 + Math.random() * 16,
          y: y + 10 + Math.random() * 12,
          size: 10 + Math.random() * 18,
          driftX: -20 + Math.random() * 40,
          driftY: 20 + Math.random() * 30,
          rotation: Math.random() * 360,
        };

        setSmellTrail((previousTrail) => [
          ...previousTrail.slice(-22),
          newPuff,
        ]);

        window.setTimeout(() => {
          setSmellTrail((previousTrail) =>
            previousTrail.filter(
              (puff) => puff.id !== newPuff.id
            )
          );
        }, 900);
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = {
        x: -9999,
        y: -9999,
      };

      setMouseGlow({
        x: -100,
        y: -100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      setParticles((previousParticles) =>
        previousParticles.map((particle) => {
          let {
            x,
            y,
            vx,
            vy,
            rotation,
            baseVx,
            baseVy,
          } = particle;

          x += vx;
          y += vy;
          rotation += particle.spin;

          const dx = x - mouseRef.current.x;
          const dy = y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const radius = 90;

          if (distance > 0 && distance < radius) {
            const force = (radius - distance) / radius;
            const angle = Math.atan2(dy, dx);

            vx += Math.cos(angle) * force * 1.8;
            vy += Math.sin(angle) * force * 1.8;
          }

          vx *= 0.96;
          vy *= 0.96;

          vx += baseVx * 0.04;
          vy += baseVy * 0.04;

          if (
            y > window.innerHeight + 80 ||
            x > window.innerWidth + 80
          ) {
            x = Math.random() * window.innerWidth - 100;
            y = -80 - Math.random() * 200;

            baseVx = 0.9 + Math.random() * 1.8;
            baseVy = 3.2 + Math.random() * 3.8;

            vx = baseVx;
            vy = baseVy;
          }

          if (x < -120) {
            x = Math.random() * window.innerWidth;
          }

          return {
            ...particle,
            x,
            y,
            vx,
            vy,
            baseVx,
            baseVy,
            rotation,
          };
        })
      );

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      styleElement.remove();
    };
  }, []);

  const mergePdfFiles = (incomingFiles) => {
    const pdfsOnly = incomingFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    setFiles((previousFiles) => {
      const fileMap = new Map();

      [...previousFiles, ...pdfsOnly].forEach((file) => {
        const key =
          file.webkitRelativePath ||
          `${file.name}-${file.size}-${file.lastModified}`;

        fileMap.set(key, file);
      });

      return Array.from(fileMap.values());
    });
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    mergePdfFiles(selectedFiles);

    event.target.value = "";
  };

  const handleFolderChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    mergePdfFiles(selectedFiles);

    event.target.value = "";
  };

  const handleScrape = async () => {
    if (
      files.length === 0 ||
      isProcessing ||
      typeof onFilesSelected !== "function"
    ) {
      return;
    }

    setIsProcessing(true);
    setProcessedFiles(0);
    setTotalFiles(files.length);

    try {
      await onFilesSelected(files, (completed) => {
        setProcessedFiles(completed);
      });
    } catch (error) {
      console.error(
        "PDF processing failed:",
        error
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFiles = () => {
    if (isProcessing) {
      return;
    }

    setFiles([]);
    setProcessedFiles(0);
    setTotalFiles(0);
  };

  const progressPercentage =
    totalFiles > 0
      ? Math.round(
          (processedFiles / totalFiles) * 100
        )
      : 0;

  return (
    <div style={styles.page}>
      <div style={styles.smellLayer}>
        {smellTrail.map((puff) => (
          <div
            key={puff.id}
            style={{
              ...styles.smellPuff,
              left: puff.x,
              top: puff.y,
              width: puff.size,
              height: puff.size,
              "--drift-x": `${puff.driftX}px`,
              "--drift-y": `${puff.driftY}px`,
              "--rotation": `${puff.rotation}deg`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          ...styles.cursorGlow,
          ...(isHoveringButton
            ? styles.cursorGlowActive
            : {}),
          left: mouseGlow.x,
          top: mouseGlow.y,
        }}
      >
        <span style={styles.pooEmoji}>💩</span>

        <span
          style={{
            ...styles.fly,
            ...styles.flyOne,
          }}
        />

        <span
          style={{
            ...styles.fly,
            ...styles.flyTwo,
          }}
        />

        <span
          style={{
            ...styles.fly,
            ...styles.flyThree,
          }}
        />
      </div>

      <div style={styles.background}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            style={{
              ...styles.bulb,
              left: 0,
              top: 0,
              fontSize: `${particle.size}px`,
              opacity: particle.opacity,
              transform: `translate3d(
                ${particle.x}px,
                ${particle.y}px,
                0
              ) rotate(${particle.rotation}deg)`,
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      <div style={styles.overlay} />

      <div style={styles.container}>
        <h2 style={styles.title}>
          PDF Scraper
        </h2>

        <div style={styles.buttonRow}>
          <label
            style={{
              ...styles.button,
              opacity: isProcessing ? 0.6 : 1,
            }}
            onMouseEnter={() =>
              setIsHoveringButton(true)
            }
            onMouseLeave={() =>
              setIsHoveringButton(false)
            }
          >
            📄 Select PDF Files

            <input
              type="file"
              accept="application/pdf,.pdf"
              multiple
              disabled={isProcessing}
              onChange={handleFileChange}
              style={styles.hiddenInput}
            />
          </label>

          <label
            style={{
              ...styles.button,
              opacity: isProcessing ? 0.6 : 1,
            }}
            onMouseEnter={() =>
              setIsHoveringButton(true)
            }
            onMouseLeave={() =>
              setIsHoveringButton(false)
            }
          >
            📁 Select Folder

            <input
              type="file"
              accept="application/pdf,.pdf"
              webkitdirectory=""
              directory=""
              multiple
              disabled={isProcessing}
              onChange={handleFolderChange}
              style={styles.hiddenInput}
            />
          </label>

          <button
            type="button"
            style={{
              ...styles.clearButton,
              opacity:
                files.length === 0 ||
                isProcessing
                  ? 0.6
                  : 1,
            }}
            onClick={clearFiles}
            disabled={
              files.length === 0 ||
              isProcessing
            }
            onMouseEnter={() =>
              setIsHoveringButton(true)
            }
            onMouseLeave={() =>
              setIsHoveringButton(false)
            }
          >
            ❌ Clear
          </button>

          <button
            type="button"
            style={{
              ...styles.scrapeButton,
              opacity:
                files.length === 0 ||
                isProcessing
                  ? 0.6
                  : 1,
            }}
            onClick={handleScrape}
            disabled={
              files.length === 0 ||
              isProcessing
            }
            onMouseEnter={() =>
              setIsHoveringButton(true)
            }
            onMouseLeave={() =>
              setIsHoveringButton(false)
            }
          >
            {isProcessing
              ? `Processing ${processedFiles}/${totalFiles}`
              : "🥄 Scrape & Export Excel"}
          </button>
        </div>

        {isProcessing && (
          <div style={styles.progressContainer}>
            <div
              style={{
                ...styles.progressCircle,
                background: `conic-gradient(
                  #16a34a ${
                    progressPercentage * 3.6
                  }deg,
                  #e5e7eb 0deg
                )`,
              }}
            >
              <div
                style={
                  styles.progressCircleInner
                }
              >
                <span
                  style={
                    styles.progressPercentage
                  }
                >
                  {progressPercentage}%
                </span>
              </div>
            </div>

            <div style={styles.progressText}>
              <strong>
                {processedFiles}/{totalFiles}{" "}
                files processed
              </strong>

              <span>
                {processedFiles < totalFiles
                  ? "Reading photometric data..."
                  : "Creating Excel file..."}
              </span>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div style={styles.fileBox}>
            <p style={styles.fileCount}>
              {files.length} PDF{" "}
              {files.length === 1
                ? "file"
                : "files"}{" "}
              selected
            </p>

            <ul style={styles.fileList}>
              {files.map((file) => {
                const fileKey =
                  file.webkitRelativePath ||
                  `${file.name}-${file.size}-${file.lastModified}`;

                return (
                  <li
                    key={fileKey}
                    style={styles.fileItem}
                  >
                    {file.webkitRelativePath ||
                      file.name}
                  </li>
                );
              })}
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
    fontFamily: "sans-serif",
    color: "#0c0c0c",
  },

  background: {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: 0,
    color: "#0c0c0c",
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
      drop-shadow(
        0 0 6px
        rgba(255, 230, 90, 0.95)
      )
      drop-shadow(
        0 0 14px
        rgba(255, 210, 70, 0.8)
      )
      drop-shadow(
        0 0 24px
        rgba(255, 190, 40, 0.45)
      )
    `,
    transition: "transform 0.03s linear",
  },

  cursorGlowActive: {
    filter: `
      drop-shadow(
        0 0 6px
        rgba(255, 80, 80, 1)
      )
      drop-shadow(
        0 0 14px
        rgba(239, 68, 68, 0.9)
      )
      drop-shadow(
        0 0 28px
        rgba(220, 38, 38, 0.6)
      )
    `,
  },

  smellLayer: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 9997,
    overflow: "hidden",
  },

  smellPuff: {
    position: "fixed",
    borderRadius: "50%",
    pointerEvents: "none",
    background:
      "radial-gradient(circle, rgba(74, 222, 128, 0.75) 0%, rgba(34, 197, 94, 0.5) 45%, rgba(22, 163, 74, 0) 75%)",
    filter: "blur(3px)",
    animation:
      "smellFade 900ms ease-out forwards",
    transform: "translate(-50%, -50%)",
  },

  pooEmoji: {
    position: "relative",
    zIndex: 2,
  },

  fly: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 4,
    height: 4,
    background: "#050505",
    borderRadius: "50%",
    boxShadow:
      "0 0 2px rgba(0,0,0,0.95)",
    pointerEvents: "none",
    zIndex: 3,
  },

  flyOne: {
    animation:
      "flyOrbitOne 1.1s linear infinite",
  },

  flyTwo: {
    animation:
      "flyOrbitTwo 1.4s linear infinite",
  },

  flyThree: {
    animation:
      "flyOrbitThree 0.9s linear infinite",
  },

  bulb: {
    position: "absolute",
    userSelect: "none",
    willChange: "transform",
    filter:
      "drop-shadow(0 0 8px rgba(255, 220, 100, 0.45))",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15, 23, 42, 0.05)",
    zIndex: 1,
    pointerEvents: "none",
  },

  container: {
    position: "relative",
    zIndex: 2,
    padding: 30,
    border:
      "1px solid rgba(255,255,255,0.15)",
    borderRadius: 16,
    background: "#0c0c0c",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    maxWidth: 700,
    width: "100%",
    margin: "auto",
    boxSizing: "border-box",
    boxShadow:
      "0 12px 40px rgba(0,0,0,0.25)",
  },

  title: {
    marginTop: 0,
    marginBottom: 20,
    color: "#3c5997",
    fontSize: 28,
  },

  buttonRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
    gap: 12,
    marginBottom: 20,
    width: "100%",
  },

  hiddenInput: {
    display: "none",
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
    boxShadow:
      "0 4px 12px rgba(79, 70, 229, 0.25)",
  },

  clearButton: {
    padding: "10px 18px",
    background: "#ef4444",
    color: "white",
    borderRadius: 8,
    cursor: "none",
    border: "none",
    fontWeight: 500,
    boxShadow:
      "0 4px 12px rgba(239, 68, 68, 0.25)",
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
    boxShadow:
      "0 4px 12px rgba(22, 163, 74, 0.25)",
  },

  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 18,
    marginBottom: 20,
    padding: 18,
    background:
      "rgba(19, 18, 18, 0.95)",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
  },

  progressCircle: {
    width: 86,
    height: 86,
    flexShrink: 0,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition:
      "background 0.25s ease",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.12)",
  },

  progressCircleInner: {
    width: 66,
    height: 66,
    borderRadius: "50%",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  progressPercentage: {
    fontSize: 17,
    fontWeight: 700,
    color: "#3159af",
  },

  progressText: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    color: "#374151",
    textAlign: "left",
  },

  fileBox: {
    background:
      "rgba(30, 35, 48, 0.95)",
    borderRadius: 8,
    padding: 15,
    border: "2px solid #253033",
    maxHeight: 300,
    overflowY: "auto",
  },

  fileCount: {
    marginTop: 0,
    marginBottom: 10,
    fontWeight: 600,
    color: "#446dc4",
  },

  fileList: {
    paddingLeft: 20,
    margin: 0,
    background: "#0e0f0f",
  },

  fileItem: {
    marginBottom: 4,
    color: "#4776c2",
    overflowWrap: "anywhere",
  },
};