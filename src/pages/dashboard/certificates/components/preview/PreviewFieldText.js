import * as React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { certificateFields } from "constants/index";

const { LABEL_MEMBER_NAME, LABEL_CATEGORY_NAME } = certificateFields;

const previewTexts = {
  [LABEL_MEMBER_NAME]: "Laksmana Tri Moerdani",
  [LABEL_CATEGORY_NAME]: "Individu - Umum - Barebow - 50m",
};

export default function PreviewFieldText({ name, data = {} }) {
  const { y, fontFamily, fontSize, color, fontWeight } = data;
  const divRef = React.useRef(null);
  const [currentOffsetWidth, setCurrentOffsetWidth] = React.useState(0);

  const placeholderString = previewTexts[name];

  React.useEffect(() => {
    setCurrentOffsetWidth(divRef.current?.offsetWidth);
  }, []);

  return (
    <FieldTextContainer
      ref={divRef}
      left={1280 / 2 - currentOffsetWidth / 2 || 0}
      fontSize={fontSize}
      color={color}
      y={y}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
    >
      {placeholderString}
    </FieldTextContainer>
  );
}

PreviewFieldText.propTypes = {
  name: PropTypes.oneOf([LABEL_MEMBER_NAME, LABEL_CATEGORY_NAME]).isRequired,
  data: PropTypes.shape({
    y: PropTypes.number,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.number,
    color: PropTypes.string,
    fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

PreviewFieldText.defaultProps = {
  data: {}
};

const FieldTextContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${({ left }) => left}px;
  font-size: ${({ fontSize }) => fontSize || 60}px;
  ${({ color }) => (color ? `color: ${color};` : "")}
  transform: translate(0px, ${({ y }) => y}px);
  ${({ fontFamily }) => (fontFamily ? `font-family: ${fontFamily};` : "")}
  font-weight: ${({ fontWeight }) => fontWeight || "normal"};
`;
