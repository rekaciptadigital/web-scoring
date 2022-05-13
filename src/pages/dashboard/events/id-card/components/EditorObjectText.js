import * as React from "react";
import Draggable from "react-draggable";

const defaultTextAttributes = {
  textAnchor: "middle",
  dominantBaseline: "middle",
};

const defaultBoundingRectAttributes = {
  fill: "none",
  strokeDasharray: "8",
};

const boundingStroke = {
  idle: {
    color: "turquoise",
    dashArray: 8,
  },
  highlighted: {
    color: "#4F80FF",
  },
};

export default function EditorObjectText({ name, data = {}, onSelected, onChange, selected }) {
  const { x, y, width, height, fontSize, fontFamily, color, fontWeight } = data;

  const selectorRef = React.useRef(null);
  const textRef = React.useRef(undefined);

  const [currentTextRect, setCurrentTextRect] = React.useState(null);
  const [currentTranslationY, setCurrentTranslationY] = React.useState(0);
  const [activeStrokeColor, setActiveStrokeColor] = React.useState(boundingStroke.idle.color);
  const [activeStrokeDashArray, setActiveStrokeDashArray] = React.useState(
    boundingStroke.idle.dashArray
  );

  const placeholderString = `{%${name}%}`;

  React.useEffect(() => {
    // Perubahan data yang memengaruhi nilai Rect pada elemen Text
    // diupdate di sini, agar objek yang bergantung pada nilai state Rect
    // dirender ulang dengan nilai benar
    setCurrentTextRect(textRef.current?.getBBox());
  }, [x, y, width, height, fontSize, fontFamily, fontWeight]);

  const highlightOnMouseOver = () => {
    setActiveStrokeColor(boundingStroke.highlighted.color);
    setActiveStrokeDashArray(boundingStroke.highlighted.dashArray);
  };

  const idleOnMouseLeave = () => {
    setActiveStrokeColor(boundingStroke.idle.color);
    setActiveStrokeDashArray(boundingStroke.idle.dashArray);
  };

  const handleDrag = (ev, position) => {
    setCurrentTranslationY(position.y);
  };

  const handleDragStop = () => {
    onChange({ y: y + currentTranslationY });
    setCurrentTranslationY(0);
  };

  return (
    <g onMouseOver={() => highlightOnMouseOver()} onMouseLeave={() => idleOnMouseLeave()}>
      {/* Indikator objek field */}
      {!selected && (
        <rect
          {...defaultBoundingRectAttributes}
          x={currentTextRect?.x}
          y={currentTextRect?.y}
          width={currentTextRect?.width}
          height={currentTextRect?.height}
          stroke={activeStrokeColor}
          strokeWidth="2"
          strokeOpacity={activeStrokeDashArray ? 0.8 : undefined}
          strokeDasharray={activeStrokeDashArray}
        />
      )}

      {/* Objek field yang sebenarnya */}
      <text
        ref={textRef}
        {...defaultTextAttributes}
        x={x}
        y={y}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontWeight={fontWeight}
        fill={color}
        cursor="default"
        onMouseDown={(ev) => onSelected?.({ rect: currentTextRect, event: ev })}
        transform={selected ? `translate(0,${currentTranslationY})` : undefined}
      >
        {placeholderString}
      </text>

      {/* Handle selektor untuk geser-geser posisi objek */}
      {selected && (
        <Draggable
          axis="y"
          scale={0.5}
          position={{ x: 0, y: currentTranslationY }}
          onDrag={(ev, position) => handleDrag(ev, position)}
          onStop={(ev, position) => handleDragStop(ev, position)}
        >
          <rect
            ref={selectorRef}
            fill="yellow"
            fillOpacity="0"
            stroke="#4F80FF"
            strokeWidth="4"
            strokeOpacity="0.8"
            x={currentTextRect?.x}
            y={currentTextRect?.y}
            width={currentTextRect?.width}
            height={currentTextRect?.height}
          />
        </Draggable>
      )}
    </g>
  );
}
