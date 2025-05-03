import { useState } from "react";
import { createPortal } from "react-dom";

const PDFWindow = ({ open, onClose, pdfUrl, title }) => {
  const [minimized, setMinimized] = useState(false);

  if (!open) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        right: 40,
        bottom: 40,
        width: minimized ? 300 : 600,
        height: minimized ? 40 : 500,
        zIndex: 1000,
        background: "white",
        border: "1px solid #ddd",
        borderRadius: 8,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        display: "flex",
        flexDirection: "column",
        transition: "height 0.2s, width 0.2s",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "#f3f4f6",
          padding: "6px 12px",
          borderBottom: "1px solid #eee",
          borderRadius: "8px 8px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 40,
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 15 }}>{title || "PDF"}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setMinimized((v) => !v)}
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "#888",
              marginRight: 4,
            }}
            title={minimized ? "Restore" : "Minimize"}
          >
            {minimized ? "🗗" : "🗕"}
          </button>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "#888",
            }}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      {!minimized && (
        <iframe
          src={pdfUrl}
          title={title}
          style={{ flex: 1, width: "100%", border: "none" }}
        />
      )}
    </div>,
    document.body
  );
};

export default PDFWindow;