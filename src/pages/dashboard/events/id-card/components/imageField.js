import * as React from "react";
import Draggable from "react-draggable";
import styled from "styled-components";


import photoPrev from "assets/images/photo_preview.png";

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

export default function ImageField({
  name,
  data = {},
  onSelected,
  onChange,
  selected,
  setEditorDirty,
  dataEditor,
}) {
  const { y, x, display } = data;

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
  }, [y, x, display]);

  React.useEffect(() => {
    setEditorDirty?.();
  }, [y, x, display]);

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
          display: display || "inline-block",
        }}
        onMouseOver={() => highlightOnMouseOver()}
        onMouseLeave={() => idleOnMouseLeave()}
      >
        <PlaceholderString>
          <QrCodeContainer x={dataEditor?.x} y={dataEditor?.y} display={dataEditor?.display} >
            <div className="qr-code-image"  />
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

  transform: translate(${({ x }) => x}px, ${({ y }) => y}px);
  
  .qr-code-centering {
    margin: 0 auto;
    width: 50mm;
    height: 50mm;
    background-color: white;
  }
  
  .qr-code-image {
    width: 50mm;
    height: 50mm;
    ${(props) => (!props.preview ? "opacity: 0.25;" : "")}
    ${(props) => (!props.preview ? "border: solid 1px #000000;" : "")}
    background-image: url(${photoPrev});
    background-size: cover;
    display: ${({ display }) => display || "inline-block"}
  }
`;
