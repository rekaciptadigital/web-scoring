import * as React from "react";
import styled from "styled-components";

function TextData({ title, text, fontSize, fontFamily, color, isBold }) {
  return (
    <Text
      title={"variabel: " + title}
      style={{
        "--data-text-font-size": fontSize + "px",
        "--data-text-font-family": fontFamily,
        "--data-text-color": color,
        "--data-text-font-weight": isBold ? 600 : "normal",
      }}
    >
      &#171; {text || "Tidak ada teks"} &#187;
    </Text>
  );
}

const Text = styled.div`
  color: var(--data-text-color, #495057);
  font-size: var(--data-text-font-size, 14px);
  font-family: var(--data-text-font-family, "DejaVu Sans", sans-serif);
  font-weight: var(--data-text-font-weight, normal);
`;

export { TextData };
