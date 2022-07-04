import * as React from "react";
import styled from "styled-components";
import { certificateFields } from "constants/index";

import EditorFieldText from "./EditorFieldText";
import QrCodeField from "./QrCodeField";

const { LABEL_RANK } = certificateFields;
// landscape
const A4_WIDTH = 1287;
const A4_HEIGHT = 910;

export default function EditorCanvasHTML({
  data,
  currentObject,
  onChange,
  onSelect,
  setEditorDirty,
}) {
  const { backgroundUrl, backgroundPreviewUrl, fields } = data;
  const containerDiv = React.useRef(null);
  const [currentOffsetWidth, setCurrentOffsetWidth] = React.useState(0);
  const canvasScale = _getCanvasScale(currentOffsetWidth, A4_WIDTH);

  React.useLayoutEffect(() => {
    containerDiv.current && setCurrentOffsetWidth(containerDiv.current?.offsetWidth);
  }, []);

  const getBackgroundImage = () => backgroundPreviewUrl || backgroundUrl || "";

  const isSelected = (name) => {
    return currentObject?.name === name;
  };

  const handleSelectField = (name) => {
    const fieldData = data.fields.find((field) => field.name === name);
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
        scale={(containerDiv.current?.offsetWidth || A4_WIDTH) / A4_WIDTH}
        style={{ "--editor-bg-image": `url(${getBackgroundImage()})` }}
      >
        <DeselectClickArea onClick={() => handleDeselectField()} />

        {fields?.length ? (
          fields.map((field) => {
            if (
              field.name === LABEL_RANK &&
              (data.typeCertificate === 1 || data.typeCertificate === 3)
            ) {
              return;
            }
            return (
              <EditorFieldText
                key={field.name}
                name={field.name}
                data={field}
                selected={isSelected(field.name)}
                onChange={(data) => onChange(data)}
                onSelected={() => handleSelectField(field.name)}
                setEditorDirty={setEditorDirty}
                canvasScale={canvasScale}
              />
            );
          })
        ) : (
          <div>Ada error pada data editor</div>
        )}

        <QrCodeField />
      </EditorBackground>
    </EditorCanvasContainer>
  );
}

const EditorCanvasContainer = styled.div`
  position: relative;
  height: 0;
  padding-bottom: ${({ ratio }) => 100 * ratio}%;
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

function _getCanvasScale(offsetWidth, actualPaperPixels) {
  if (!offsetWidth) {
    return 1;
  }
  return offsetWidth / actualPaperPixels;
}
