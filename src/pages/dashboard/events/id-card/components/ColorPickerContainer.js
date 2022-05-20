import * as React from "react";

export default function ColorPickerContainer({ children, color = "#495057" }) {
  const [isShowPicker, setShowPicker] = React.useState(false);
  return (
    <React.Fragment>
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
        onClick={() => setShowPicker((show) => !show)}
      >
        <h5
          style={{
            margin: 0,
            fontWeight: 700,
            color: color,
          }}
        >
          A
        </h5>
        <div />
      </div>

      {isShowPicker && (
        <div style={{ position: "absolute" }}>
          <div
            style={{
              position: "fixed",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px",
            }}
            onClick={() => setShowPicker(false)}
          />
          {children}
        </div>
      )}
    </React.Fragment>
  );
}
