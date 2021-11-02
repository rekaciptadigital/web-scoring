import * as React from "react";

export default function FontBoldToggle({ onChange, bold = false }) {
  return (
    <div
      style={{
        padding: 5,
        width: 42,
        background: "#fff",
        borderRadius: 4,
        boxShadow: "0 0 0 1px rgb(204, 204, 204)",
        display: "inline-block",
        cursor: "pointer",
        textAlign: "center",
      }}
      onClick={() => onChange?.()}
    >
      <h5
        style={{
          margin: 0,
          fontWeight: bold ? "700" : undefined,
        }}
      >
        B
      </h5>
      <div />
    </div>
  );
}
