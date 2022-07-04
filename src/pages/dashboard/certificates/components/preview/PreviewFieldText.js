import * as React from "react";
import styled from "styled-components";
import { certificateFields } from "constants/index";

const { LABEL_MEMBER_NAME, LABEL_CATEGORY_NAME, LABEL_RANK } = certificateFields;

const previewTexts = {
  [LABEL_MEMBER_NAME]: "Morgan Lundin",
  [LABEL_RANK]: "Juara 1",
  [LABEL_CATEGORY_NAME]: "Individu - Umum - Barebow - 50m",
};

export default function PreviewFieldText({ name, data = {} }) {
  const { x, y, offsetWidth, fontFamily, fontSize, color, fontWeight } = data;
  const divRef = React.useRef(null);
  const [currentOffsetWidth, setCurrentOffsetWidth] = React.useState(0);

  const placeholderString = previewTexts[name];
  const editorObject = { x, offsetWidth };
  const previewObject = { offsetWidth: currentOffsetWidth };
  const rightAlignedX = _getRightAlignedX(editorObject, previewObject);

  React.useEffect(() => {
    divRef.current && setCurrentOffsetWidth(divRef.current.offsetWidth);
  }, []);

  return (
    <FieldTextContainer
      ref={divRef}
      fontSize={fontSize}
      color={color}
      y={y}
      x={rightAlignedX}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
    >
      {placeholderString}
    </FieldTextContainer>
  );
}

const FieldTextContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  text-align: right;
  font-size: ${({ fontSize }) => fontSize || 60}px;
  ${({ color }) => (color ? `color: ${color};` : "")}
  transform: translate(${({ x }) => x}px, ${({ y }) => y}px);
  ${({ fontFamily }) => (fontFamily ? `font-family: ${fontFamily};` : "")}
  font-weight: ${({ fontWeight }) => fontWeight || "normal"};
`;

function _getRightAlignedX(editorObject, previewObject) {
  const delta = previewObject.offsetWidth - editorObject.offsetWidth;
  return editorObject.x - delta;
}
