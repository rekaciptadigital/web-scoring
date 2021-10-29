import * as React from "react";
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

export default function EditorFieldText({ name, data = {}, onSelected, onChange, selected }) {
  const { y, fontFamily, fontSize, color, fontWeight } = data;

  const divRef = React.useRef(null);
  const [currentOffsetWidth, setCurrentOffsetWidth] = React.useState(0);
  const [activeStrokeColor, setActiveStrokeColor] = React.useState(boundingStroke.idle.color);
  const [activeStrokeDashArray, setActiveStrokeDashArray] = React.useState(
    boundingStroke.idle.dashArray
  );

  const placeholderString = `{%${name}%}`;

  React.useEffect(() => {
    // Perubahan data yang memengaruhi width DOM perlu diupdate di sini,
    // agar jarak left & transform x bisa dikalkulasi ulang dengan benar
    setCurrentOffsetWidth(divRef.current?.offsetWidth);
  }, [fontSize, fontFamily, fontWeight]);

  const highlightOnMouseOver = () => {
    setActiveStrokeColor(boundingStroke.highlighted.color);
    setActiveStrokeDashArray(boundingStroke.highlighted.dashArray);
  };

  const idleOnMouseLeave = () => {
    setActiveStrokeColor(boundingStroke.idle.color);
    setActiveStrokeDashArray(boundingStroke.idle.dashArray);
  };

  const handleDrag = () => {
    onSelected?.();
  };

  const handleDragStop = (position) => {
    onChange?.({ y: position.y });
  };

  return (
    <Draggable
      axis="y"
      scale={0.5}
      defaultPosition={{ x: 0, y }}
      onStart={() => handleDrag()}
      onStop={(ev, position) => handleDragStop(position)}
    >
      <div
        ref={divRef}
        style={{
          position: "absolute",
          top: 0,
          left: 1280 / 2 - currentOffsetWidth / 2 || 0,
          fontSize: fontSize || 60,
          color: color || undefined,
          fontFamily: fontFamily || undefined,
          fontWeight: fontWeight || "normal",
        }}
        onMouseOver={() => highlightOnMouseOver()}
        onMouseLeave={() => idleOnMouseLeave()}
      >
        {placeholderString}

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
