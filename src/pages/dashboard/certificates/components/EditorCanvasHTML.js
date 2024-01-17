import React, { useRef, useLayoutEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
// import { certificateFields } from "constants/index";

import EditorFieldText from "./EditorFieldText";
// import QrCodeField from "./QrCodeField"; // Unused import, commented out

const A4_WIDTH = 1287;
const A4_HEIGHT = 910;

function EditorCanvasHTML({
  data,
  currentObject,
  onChange,
  onSelect,
  setEditorDirty,
}) {
  const { backgroundUrl, backgroundPreviewUrl, fields } = data;
  const containerDiv = useRef(null);
  const currentOffsetWidth = useRef(0);
  const canvasScale = getCanvasScale(currentOffsetWidth.current, A4_WIDTH);

  useLayoutEffect(() => {
    if (containerDiv.current) {
      currentOffsetWidth.current = containerDiv.current.offsetWidth;
    }
  }, [data]);

  const getBackgroundImage = () => backgroundPreviewUrl || backgroundUrl || "";

  const isSelected = (name) => currentObject?.name === name;

  const handleSelectField = (name) => {
    const fieldData = fields.find((field) => field.name === name);
    onSelect({ ...fieldData });
  };

  const handleDeselectField = () => {
    onSelect(null);
  };

  return (
    <EditorCanvasContainer ref={containerDiv} ratio={A4_HEIGHT / A4_WIDTH}>
      <EditorBackground
        width={A4_WIDTH}
        height={A4_HEIGHT}
        scale={(currentOffsetWidth.current || A4_WIDTH) / A4_WIDTH}
        style={{ "--editor-bg-image": `url(${getBackgroundImage()})` }}
      >
        <DeselectClickArea onClick={handleDeselectField} />

        {fields?.length ? (
          fields.map((field) => (
            <EditorFieldText
              key={field.name}
              name={field.name}
              data={field}
              selected={isSelected(field.name)}
              onChange={onChange}
              onSelected={() => handleSelectField(field.name)}
              setEditorDirty={setEditorDirty}
              canvasScale={canvasScale}
            />
          ))
        ) : (
          <div>Ada error pada data editor</div>
        )}

        {/* <QrCodeField /> */}
      </EditorBackground>
    </EditorCanvasContainer>
  );
}

EditorCanvasHTML.propTypes = {
  data: PropTypes.shape({
    backgroundUrl: PropTypes.string,
    backgroundPreviewUrl: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.object),
    typeCertificate: PropTypes.number,
  }),
  currentObject: PropTypes.object,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  setEditorDirty: PropTypes.func,
};

const EditorCanvasContainer = styled.div`
  position: relative;
  height: 0;
  padding-bottom: ${({ ratio }) => (ratio * 100).toFixed(2)}%;
  overflow: hidden;
`;

const EditorBackground = styled.div`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: white;
  background-image: var(--editor-bg-image);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transform: scale(${({ scale }) => scale});
  transform-origin: top left;
`;

const DeselectClickArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

function getCanvasScale(offsetWidth, actualPaperPixels) {
  if (!offsetWidth) {
    return 1;
  }
  return offsetWidth / actualPaperPixels;
}

export default EditorCanvasHTML;
