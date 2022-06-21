import * as React from "react";
import styled from "styled-components";
import { useEditor } from "../../../contexts/editor-data";

function TextData({ title, text, fontSize, fontFamily, color, isBold }) {
  const { getConfigMaxTextWidth } = useEditor();
  const textWidth = getConfigMaxTextWidth();
  return (
    <Text
      title={"variabel: " + title}
      style={{
        "--data-text-container-width": textWidth + "px",
        "--data-text-font-size": fontSize + "px",
        "--data-text-font-family": fontFamily,
        "--data-text-color": color,
        "--data-text-font-weight": isBold ? 600 : "normal",
      }}
    >
      {text || "Tidak ada teks"}
    </Text>
  );
}

const Text = styled.div`
  width: var(--data-text-container-width);
  color: var(--data-text-color, #495057);
  font-size: var(--data-text-font-size, 14px);
  font-family: var(--data-text-font-family, "DejaVu Sans", sans-serif);
  font-weight: var(--data-text-font-weight, normal);
  text-align: center;
`;

export { TextData };
