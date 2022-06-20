import * as React from "react";
import styled from "styled-components";
import { useContainerOffsetWidth } from "../../hooks/container-offset-width";
import { useEditor } from "../../contexts/editor-data";

import { MoveableObject } from "./components/moveable-object";
import { FieldDataObject } from "./components/field-data-object";

// TODO: moveable components:
// - [ ] 1. Text data: data digenerate dari server
// - [ ] 2. Editable text: data digenerate, tapi bisa diedit dari UI
// - [ ] 3. Static text: data dari UI, tapi gak disimpan di server/DB
// - [ ] 4. Image data: data image digenerate dari server
// - [ ] 5. Editable image data

function CanvasArea() {
  const containerDiv = React.useRef(null);
  const offsetWidth = useContainerOffsetWidth(containerDiv);

  const {
    data: editorData,
    getPaperDimensions,
    getBgImage,
    visibleFields,
    setFieldPosition,
    activeObject: activeObjectName,
    setActiveObject,
  } = useEditor();
  const { width, height } = getPaperDimensions();
  const canvasScale = _getCanvasScale(offsetWidth, width);
  const bgImage = getBgImage();

  const getObjectProps = (name) => {
    return {
      scale: canvasScale,
      isSelected: activeObjectName === name,
      onSelect: () => setActiveObject(name || null),
    };
  };

  return (
    <CanvasContainer
      ref={containerDiv}
      title={_makeContainerTitleText(editorData)}
      style={{ "--canvas-area-ratio": `${100 * (height / width)}%` }}
    >
      <MoveableArea
        key={editorData.key}
        width={width}
        height={height}
        canvasScale={canvasScale}
        bgImage={bgImage}
        onDeselect={() => setActiveObject(null)}
      >
        {visibleFields.map((field) => (
          <MoveableObject
            key={field.name}
            {...getObjectProps(field.name)}
            x={field.x}
            y={field.y}
            onMove={({ x, y } = {}) => setFieldPosition(field.name, { x, y })}
          >
            <FieldDataObject field={field} />
          </MoveableObject>
        ))}
      </MoveableArea>
    </CanvasContainer>
  );
}

function MoveableArea({ children, width, height, canvasScale, bgImage, onDeselect }) {
  return (
    <MoveableContainer
      style={{
        "--canvas-actual-width": `${width}px`,
        "--canvas-actual-height": `${height}px`,
        "--canvas-scale": canvasScale,
        "--canvas-bg-image": bgImage && `url("${bgImage}")`,
      }}
    >
      <DeselectClickArea onClick={onDeselect} />
      {children}
    </MoveableContainer>
  );
}

/* ================================ */
// styles

const CanvasContainer = styled.div`
  position: relative;
  overflow: hidden;

  /**
    * Aspect ratio hack:
    * Persentase padding bottom berdasarkan perbandingan "aspect-ratio" height : width => (height/width * 100%)
    * Contoh: A4 landscape dihitung 70.9375%, berarti
    * padding bottom-nya (yang jadi "fake" height-nya) sebesar 70.9375% dari width-nya
    */
  height: 0;
  padding-bottom: var(--canvas-area-ratio, 100%);
`;

const MoveableContainer = styled.div`
  width: var(--canvas-actual-width);
  height: var(--canvas-actual-height);
  transform: scale(var(--canvas-scale, 1));
  transform-origin: top left;

  background-color: white;
  background-image: var(--canvas-bg-image);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

const DeselectClickArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

/* ================================= */
// utils

function _getCanvasScale(offsetWidth, actualPaperPixels) {
  if (!offsetWidth) {
    return 1;
  }
  return offsetWidth / actualPaperPixels;
}

function _makeContainerTitleText(data) {
  if (!data?.paperSize || !data?.paperOrientation) {
    return;
  }
  const orientationLabels = {
    p: "Portrait",
    l: "Landscape",
  };
  return `Kertas ${data.paperSize.toUpperCase?.()} (${orientationLabels[data.paperOrientation]})`;
}

export { CanvasArea };
