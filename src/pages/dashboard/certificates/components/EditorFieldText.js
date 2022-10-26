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

function PlaceholderString({ children }) {
  return <React.Fragment>&laquo;{children}&raquo;</React.Fragment>;
}

export default function EditorFieldText({
  name,
  data = {},
  onSelected,
  onChange,
  selected,
  setEditorDirty,
}) {
  const divRef = React.useRef(null);
  const [currentOffsetWidth, setCurrentOffsetWidth] = React.useState(0);
  const [activeStrokeColor, setActiveStrokeColor] = React.useState(boundingStroke.idle.color);
  const [activeStrokeDashArray, setActiveStrokeDashArray] = React.useState(
    boundingStroke.idle.dashArray
  );
  const { y, fontFamily, fontSize, color, fontWeight } = data;

  const translatePosition = { x: 0, y };

  React.useLayoutEffect(() => {
    // Perubahan data yang memengaruhi width DOM perlu diupdate di sini,
    // agar jarak left & transform x bisa dikalkulasi ulang dengan benar
    divRef.current && setCurrentOffsetWidth(divRef.current.offsetWidth);
    const data = { offsetWidth: divRef.current.offsetWidth || 0 };
    onChange?.(data);
  }, [fontSize, fontFamily, fontWeight]);

  React.useEffect(() => {
    setEditorDirty?.();
  }, [y, fontSize, fontFamily, fontWeight, color]);

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
    onChange?.({ y: translation.y });
    // const data = {
    //   x: Math.ceil(translation.x),
    //   y: Math.ceil(translation.y),
    //   offsetWidth: currentOffsetWidth,
    // };
    // onChange?.(data);
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
          fontSize: fontSize || 60,
          color: color || undefined,
          fontFamily: fontFamily || undefined,
          fontWeight: fontWeight || "normal",
          textAlign: "right",
        }}
        onMouseOver={() => highlightOnMouseOver()}
        onMouseLeave={() => idleOnMouseLeave()}
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
