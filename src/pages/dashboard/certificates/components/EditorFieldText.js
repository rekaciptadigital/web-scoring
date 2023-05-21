import React, { Fragment, useRef, useEffect, useState, useLayoutEffect } from "react";
import Draggable from "react-draggable";

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
      <div
        ref={divRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          fontSize: fontSize || 60,
          color,
          fontFamily,
          fontWeight: fontWeight || "normal",
          ...getAlignmentStyle(),
        }}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
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
          }}
        />
      </div>
    </Draggable>
  );
}
