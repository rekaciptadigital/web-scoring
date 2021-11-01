import * as React from "react";
import EditorFieldText from "./EditorFieldText";

export default function EditorCanvasHTML({ data, currentObject, onChange, onSelect }) {
  const { backgroundImage, backgroundUrl, backgroundPreviewUrl, fields } = data;
  const containerDiv = React.useRef(null);

  const getBackgroundImage = () => backgroundUrl || backgroundPreviewUrl || backgroundImage;

  const isSelected = (name) => {
    return currentObject?.name === name;
  };

  const handleSelectField = (name) => {
    const fieldData = data.fields.find((field) => field.name === name);
    onSelect({ ...fieldData });
  };

  const handleDeselectField = () => {
    onSelect(null);
  };

  return (
    <div
      ref={containerDiv}
      style={{
        position: "relative",
        height: 0,
        paddingBottom: `${100 * (908 / 1280)}%`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 1280,
          height: 908,
          backgroundColor: "white",
          backgroundImage: `url(${getBackgroundImage()})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          transform: `scale(${containerDiv.current?.offsetWidth / 1280})`,
          transformOrigin: "top left",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onClick={() => handleDeselectField()}
        />

        {fields?.length ? (
          fields.map((field) => (
            <EditorFieldText
              key={field.name}
              name={field.name}
              data={field}
              selected={isSelected(field.name)}
              onChange={(data) => onChange(data)}
              onSelected={() => handleSelectField(field.name)}
            />
          ))
        ) : (
          <div>Ada error pada data editor</div>
        )}
      </div>
    </div>
  );
}
