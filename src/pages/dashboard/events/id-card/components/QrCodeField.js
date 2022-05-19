import * as React from "react";
import Draggable from "react-draggable";
import styled from "styled-components";


import qrPreviewSvg from "assets/images/editor-qr-preview.svg";

const boundingStroke = {
  idle: {
    color: "turquoise",
    dashArray: "dashed",
  },
  highlighted: {
    color: "#4F80FF",
    dashArray: "solid",
  },
};

function PlaceholderString({ children }) {
  return <React.Fragment>&laquo;{children}&raquo;</React.Fragment>;
}

export default function QrCodeField({
  name,
  data = {},
  onSelected,
  onChange,
  selected,
  setEditorDirty,
  dataEditor,
}) {
  const { y, x } = data;

  const divRef = React.useRef(null);
  const [currentOffsetWidth, setCurrentOffsetWidth] = React.useState(0);
  const [activeStrokeColor, setActiveStrokeColor] = React.useState(boundingStroke.idle.color);
  const [activeStrokeDashArray, setActiveStrokeDashArray] = React.useState(
    boundingStroke.idle.dashArray
  );

  const translatePosition = { x, y };

  React.useEffect(() => {
    // Perubahan data yang memengaruhi width DOM perlu diupdate di sini,
    // agar jarak left & transform x bisa dikalkulasi ulang dengan benar
    setCurrentOffsetWidth(divRef.current?.offsetWidth);
  }, []);

  React.useEffect(() => {
    setEditorDirty?.();
  }, [y, x]);

  const highlightOnMouseOver = () => {
    setActiveStrokeColor(boundingStroke.highlighted.color);
    setActiveStrokeDashArray(boundingStroke.highlighted.dashArray);
  };

  const idleOnMouseLeave = () => {
    setActiveStrokeColor(boundingStroke.idle.color);
    setActiveStrokeDashArray(boundingStroke.idle.dashArray);
  };

  const handleDrag = () => {
    onSelected?.(name);
  };

  const handleDragStop = (translation) => {
    onChange?.({ y: translation.y, x: translation.x });
  };

  return (
    <Draggable
      axis="y"
      scale={0.5}
      position={translatePosition}
      onStart={() => handleDrag()}
      onStop={(ev, position) => handleDragStop(position)}
    >
      <div
        ref={divRef}
        style={{
          position: "absolute",
          top: 0,
          left: 1280 / 2 - currentOffsetWidth / 2 || 0,
        }}
        onMouseOver={() => highlightOnMouseOver()}
        onMouseLeave={() => idleOnMouseLeave()}
      >
        <PlaceholderString>
          <QrCodeContainer>
            <div className="qr-code-image" x={dataEditor?.x} y={dataEditor?.y} />
          </QrCodeContainer>
        </PlaceholderString>

        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderWidth: selected ? 5 : 3,
            borderStyle: selected ? "solid" : activeStrokeDashArray,
            borderColor: selected ? "#4F80FF" : activeStrokeColor,
            opacity: 0.5,
            transition: "all",
          }}
        />
      </div>
    </Draggable>
  );
}

const QrCodeContainer = styled.div`

  .qr-code-centering {
    margin: 0 auto;
    width: 50mm;
    height: 50mm;
    background-color: white;
    transform: translate(${({ x }) => x}px, ${({ y }) => y}px);
  }

  .qr-code-image {
    width: 50mm;
    height: 50mm;
    ${(props) => (!props.preview ? "opacity: 0.25;" : "")}
    ${(props) => (!props.preview ? "border: solid 1px #000000;" : "")}
    background-image: url(${qrPreviewSvg});
    background-size: cover;
  }
`;
