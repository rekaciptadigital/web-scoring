import * as React from "react";

function ProcessingBlocker() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        opacity: 0.5,
      }}
    />
  );
}

export { ProcessingBlocker };
