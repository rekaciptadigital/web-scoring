import React, { Fragment, useRef, useEffect, useState, useLayoutEffect } from "react";
import Draggable from "react-draggable";
import PropTypes from 'prop-types';

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

const A4_WIDTH = 1287;

function PlaceholderString({ children }) {
  return <Fragment>&laquo;{children}&raquo;</Fragment>;
}

PlaceholderString.propTypes = {
  children: PropTypes.node.isRequired
};

export default function EditorFieldText({
  name,
  data = {},
  onSelected,
  onChange,
  selected,
  setEditorDirty,
  canvasScale,
  align = "right", // Default alignment is right
}) {
  const divRef = useRef(null);
  const [currentOffsetWidth, setCurrentOffsetWidth] = useState(0);
  const [activeStroke, setActiveStroke] = useState(boundingStroke.idle);

  const { x, y, fontFamily, fontSize, color, fontWeight } = data;

  useLayoutEffect(() => {
    if (divRef.current) {
      setCurrentOffsetWidth(divRef.current.offsetWidth);
      const data = { offsetWidth: divRef.current.offsetWidth || 0 };
      onChange?.(data);
    }
  }, [fontSize, fontFamily, fontWeight]);

  useEffect(() => {
    setEditorDirty?.();
  }, [x, y, fontSize, fontFamily, fontWeight, color]);

  const handleDrag = () => {
    onSelected?.(name);
  };

  const handleDragStop = (ev, { x, y }) => {
    let finalX = x;
    const middleCanvas = A4_WIDTH / 2;
    const diff = Math.abs(middleCanvas - (x + currentOffsetWidth / 2));

    if (diff < 50) {
      finalX = middleCanvas - currentOffsetWidth / 2;
    }

    const data = {
      x: finalX,
      y,
      offsetWidth: currentOffsetWidth,
    };

    onChange?.(data);
  };

  const handleMouseOver = () => {
    setActiveStroke(boundingStroke.highlighted);
  };

  const handleMouseLeave = () => {
    setActiveStroke(boundingStroke.idle);
  };

  const handleFocus = () => {
    setActiveStroke(boundingStroke.highlighted);
  };

  const handleBlur = () => {
    setActiveStroke(boundingStroke.idle);
  };

  const handleKeyDown = (event) => {
    const STEP = 1;
    let newX = x;
    let newY = y;

    switch (event.key) {
      case "ArrowLeft":
        newX -= STEP;
        break;
      case "ArrowRight":
        newX += STEP;
        break;
      case "ArrowUp":
        newY -= STEP;
        break;
      case "ArrowDown":
        newY += STEP;
        break;
      default:
        return;
    }

    event.preventDefault();
    onChange?.({ x: newX, y: newY, offsetWidth: currentOffsetWidth });
  };

  const getAlignmentStyle = () => {
    if (align === "left") {
      return { textAlign: "left" };
    } else if (align === "center") {
      return { textAlign: "center" };
    } else if (align === "right") {
      return { textAlign: "right" };
    }
    return {};
  };

  return (
    <Draggable scale={canvasScale} position={{ x, y }} onStart={handleDrag} onStop={handleDragStop}>
      <button
        ref={divRef}
        type="button"
        aria-label={`Draggable text field ${name}`}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          fontSize: fontSize || 60,
          color,
          fontFamily,
          fontWeight: fontWeight || "normal",
          ...getAlignmentStyle(),
          // Reset button styles
          border: "none",
          background: "none",
          padding: 0,
          margin: 0,
          cursor: "move",
          outline: "none",
          boxShadow: "none",
        }}
        onTouchStart={handleDrag}
        onTouchEnd={(e) => handleDragStop(e, { x, y })}
      >
        <PlaceholderString>{name}</PlaceholderString>
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
            outline: "none",
            boxShadow: document.activeElement === divRef.current ? "0 0 0 3px rgba(79, 128, 255, 0.5)" : "none",
            pointerEvents: "none", // Ensure span doesn't interfere with button interactions
          }}
        />
      </button>
    </Draggable>
  );
}

EditorFieldText.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.number,
    color: PropTypes.string,
    fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onSelected: PropTypes.func,
  onChange: PropTypes.func,
  selected: PropTypes.bool,
  setEditorDirty: PropTypes.func,
  canvasScale: PropTypes.number,
  align: PropTypes.oneOf(['left', 'center', 'right'])
};

EditorFieldText.defaultProps = {
  data: {},
  align: 'right',
  canvasScale: 1,
  selected: false
};
