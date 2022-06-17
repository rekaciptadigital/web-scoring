import * as React from "react";
import styled from "styled-components";
import { useContainerOffsetWidth } from "../../hooks/container-offset-width";

import { useEditor } from "../../contexts/editor-data";

import { MoveableObject } from "./components/moveable-object";

import IconImage from "components/ma/icons/mono/image";

// TODO: moveable components:
// - [ ] 1. Text data: data digenerate dari server
// - [ ] 2. Editable text: data digenerate, tapi bisa diedit dari UI
// - [ ] 3. Static text: data dari UI, tapi gak disimpan di server/DB
// - [ ] 4. Image data: data image digenerate dari server
// - [ ] 5. Editable image data

function CanvasArea() {
  const containerDiv = React.useRef(null);
  const offsetWidth = useContainerOffsetWidth(containerDiv);

  const { getPaperDimensions } = useEditor();
  const { width, height } = getPaperDimensions();
  const canvasScale = _getCanvasScale(offsetWidth, width);

  const [selected, setSelected] = React.useState(null);
  const isSelected = (name) => selected === name;

  const setObjectPosition = (name, coordinate) => console.log(name, coordinate);

  const getObjectProps = ({ name, onMove } = {}) => {
    return {
      scale: canvasScale,
      onMove: onMove,
      isSelected: name && isSelected(name),
      onSelect: () => name && setSelected(name),
    };
  };

  return (
    <CanvasContainer
      ref={containerDiv}
      style={{ "--canvas-area-ratio": `${100 * (height / width)}%` }}
    >
      <MoveableArea
        width={width}
        height={height}
        canvasScale={canvasScale}
        bgImage={undefined}
        onDeselect={() => setSelected(null)}
      >
        <MoveableObject
          {...getObjectProps({
            name: "memberName",
            onMove: ({ x, y } = {}) => setObjectPosition("memberName", { x, y }),
          })}
        >
          <TextData text={"FAKE MEMBER NAME DATA - any kind of object -- XXXLPW"} />
        </MoveableObject>

        <MoveableObject
          {...getObjectProps({
            name: "svgIcon",
            onMove: ({ x, y } = {}) => setObjectPosition("svgIcon", { x, y }),
          })}
        >
          <div>
            <IconImage size="160" />
          </div>
          <h2>Anggap aja QR</h2>
        </MoveableObject>

        <MoveableObject
          {...getObjectProps({
            name: "budrestNumber",
            onMove: ({ x, y } = {}) => setObjectPosition("budrestNumber", { x, y }),
          })}
        >
          <TextData text={"Nomor Bantalan"} />
        </MoveableObject>

        <MoveableObject
          {...getObjectProps({
            name: "categoryDetailName",
            onMove: ({ x, y } = {}) => setObjectPosition("categoryDetailName", { x, y }),
          })}
        >
          <TextData text={"Kategori Pertandingan"} />
        </MoveableObject>

        <MoveableObject
          {...getObjectProps({
            name: "clubName",
            onMove: ({ x, y } = {}) => setObjectPosition("clubName", { x, y }),
          })}
        >
          <TextData text={"Nama Klub"} />
        </MoveableObject>

        <MoveableObject
          {...getObjectProps({
            name: "eventName",
            onMove: ({ x, y } = {}) => setObjectPosition("eventName", { x, y }),
          })}
        >
          <TextData text={"Nama Event"} />
        </MoveableObject>
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
        "--canvas-bg-image": bgImage,
      }}
    >
      <DeselectClickArea onClick={onDeselect} />
      {children}
    </MoveableContainer>
  );
}

function TextData({ text }) {
  return <h1>{text || "Tidak ada teks"}</h1>;
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
  background-color: white;
  background-image: var(--editor-bg-image);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transform: scale(var(--canvas-scale, 1));
  transform-origin: top left;
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

export { CanvasArea };
