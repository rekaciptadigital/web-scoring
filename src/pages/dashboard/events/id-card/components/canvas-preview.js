import * as React from "react";
import styled from "styled-components";
import { useContainerOffsetWidth } from "../hooks/container-offset-width";

const A4_LANDSCAPE = {
  width: 1280,
  height: 908,
};

function PreviewCanvas() {
  const containerDiv = React.useRef(null);
  const offsetWidth = useContainerOffsetWidth(containerDiv);
  const { width, height } = A4_LANDSCAPE;
  return (
    <CanvasAreaContainer
      ref={containerDiv}
      style={{ "--canvas-area-ratio": `${100 * (height / width)}%` }}
    >
      <CanvasBackground
        style={{
          "--canvas-actual-width": `${width}px`,
          "--canvas-actual-height": `${height}px`,
          "--canvas-scale": _getCanvasScale(offsetWidth, width),
        }}
      >
        <h1>Teks Uhuy</h1>
      </CanvasBackground>
    </CanvasAreaContainer>
  );
}

const CanvasAreaContainer = styled.div`
  position: relative;
  height: 0;
  padding-bottom: var(--canvas-area-ratio, 100%);
  overflow: hidden;
`;

const CanvasBackground = styled.div`
  width: var(--canvas-actual-width);
  height: var(--canvas-actual-height);
  background-color: white;
  background-image: var(--editor-bg-image);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transform: scale(var(--canvas-scale, 1));
  transform-origin: top left;

  /* placeholder sementara */
  display: flex;
  justify-content: center;
  align-items: center;
`;

function _getCanvasScale(offsetWidth, actualPaperPixels) {
  if (!offsetWidth) {
    return 1;
  }
  return offsetWidth / actualPaperPixels;
}

export { PreviewCanvas };
