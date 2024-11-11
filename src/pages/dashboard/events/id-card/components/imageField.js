import * as React from "react";
import PropTypes from "prop-types";
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

PlaceholderString.propTypes = {
  children: PropTypes.node.isRequired,
};

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
  const [activeStroke, setActiveStroke] = React.useState(boundingStroke.idle);

  const translatePosition = { x, y };

  React.useEffect(() => {
    setCurrentOffsetWidth(divRef.current?.offsetWidth);
  }, [y, x, display]);

  React.useEffect(() => {
    setEditorDirty?.();
  }, [y, x, display]);

  const highlightOnMouseOver = () => setActiveStroke(boundingStroke.highlighted);
  const idleOnMouseLeave = () => setActiveStroke(boundingStroke.idle);

  const handleDrag = () => onSelected?.(name);
  const handleDragStop = (translation) => onChange?.({ y: translation.y, x: translation.x });

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      onSelected?.(name);
    }
  };

  return (
    <Draggable
      scale={0.5}
      position={translatePosition}
      onStart={handleDrag}
      onStop={(ev, position) => handleDragStop(position)}
    >
      <button
        ref={divRef}
        onKeyDown={handleKeyDown}
        style={{
          position: "absolute",
          top: 0,
          left: 1280 / 2 - currentOffsetWidth / 2 || 0,
          display: display || "inline-block",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
        onMouseOver={highlightOnMouseOver}
        onFocus={highlightOnMouseOver}
        onMouseLeave={idleOnMouseLeave}
        onBlur={idleOnMouseLeave}
      >
        <PlaceholderString>
          <QrCodeContainer x={dataEditor?.x} y={dataEditor?.y} display={dataEditor?.display}>
            <div className="qr-code-image" />
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
            borderStyle: selected ? "solid" : activeStroke.dashArray,
            borderColor: selected ? "#4F80FF" : activeStroke.color,
            opacity: 0.5,
            transition: "all",
          }}
        />
      </button>
    </Draggable>
  );
}

ImageField.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.shape({
    y: PropTypes.number,
    x: PropTypes.number,
    display: PropTypes.string,
  }),
  onSelected: PropTypes.func,
  onChange: PropTypes.func,
  selected: PropTypes.bool,
  setEditorDirty: PropTypes.func,
  dataEditor: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    display: PropTypes.string,
  }),
};

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
    display: ${({ display }) => display || "inline-block"};
  }
`;
