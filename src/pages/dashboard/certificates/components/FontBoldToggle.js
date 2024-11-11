import * as React from "react";
import PropTypes from "prop-types";

export default function FontBoldToggle({ onChange, bold = false }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChange?.();
    }
  };

  return (
    <button
      type="button"
      style={{
        padding: 5,
        width: 42,
        background: "#fff",
        borderRadius: 4,
        boxShadow: "0 0 0 1px rgb(204, 204, 204)",
        display: "inline-block",
        cursor: "pointer",
        textAlign: "center",
        border: "none",
      }}
      onKeyDown={handleKeyDown}
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
    </button>
  );
}

FontBoldToggle.propTypes = {
  onChange: PropTypes.func,
  bold: PropTypes.bool
};
