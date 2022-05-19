import * as React from "react";
import styled from "styled-components";

import EditorFieldText from "./EditorFieldText";
import QrCodeField from "./QrCodeField";

export default function EditorCanvasHTML({
  data,
  currentObject,
  onChange,
  onSelect,
  setEditorDirty,
}) {
  const { backgroundUrl, backgroundPreviewUrl, fields } = data;
  const containerDiv = React.useRef(null);

  const getBackgroundImage = () => backgroundPreviewUrl || backgroundUrl || "";

  const isSelected = (name) => {
    return currentObject?.name === name;
  };

  const handleSelectField = (name) => {
    const fieldData = data.fields.find((field) => field.name === name);
    onSelect({ ...fieldData });
  };

  const handleSelectQrField = () => {
    onSelect({ ...data.qrFields });
  };

  const handleDeselectField = () => {
    onSelect(null);
  };

  return (
    <EditorCanvasContainer ref={containerDiv} ratio={908 / 1280}>
      <EditorBackground
        width={1280}
        height={908}
        scale={containerDiv.current?.offsetWidth / 1280}
        style={{ "--editor-bg-image": `url(${getBackgroundImage()})` }}
      >
        <DeselectClickArea onClick={() => handleDeselectField()} />

        {fields?.length ? (
          fields.map((field) => {
            return (
              <EditorFieldText
                key={field.name}
                name={field.name}
                data={field}
                selected={isSelected(field.name)}
                onChange={(data) => onChange(data)}
                onSelected={() => handleSelectField(field.name)}
                setEditorDirty={setEditorDirty}
              />
            );
          })
        ) : (
          <div>Ada error pada data editor</div>
        )}

        <QrCodeField 
          key={data.qrFields.name}
          name={data.qrFields.name}
          data={data.qrFields}
          onSelected={() => handleSelectQrField(data.qrFields.name)}
          selected={isSelected(data.qrFields.name)}
          onChange={(data) => onChange(data)}
          setEditorDirty={setEditorDirty}
          />
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
