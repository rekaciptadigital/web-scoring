import * as React from "react";
import EditorFieldText from "./EditorFieldText";

export default function EditorCanvasHTML({ data, currentObject, onChange, onSelect }) {
  const { backgroundUrl, backgroundPreviewUrl, fields } = data;
  const containerDiv = React.useRef(null);

  const getBackgroundImage = () => backgroundUrl || backgroundPreviewUrl;

  const isSelected = (name) => {
    return currentObject?.name === name;
  };

  const handleSelect = (name) => {
    onSelect({ name });
  };

  const handleDeselect = () => {
    onSelect({ name: undefined });
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
          onClick={() => handleDeselect()}
        />

        <EditorFieldText
          name="member_name"
          data={fields?.["member_name"]}
          selected={isSelected("member_name")}
          onChange={(data) => onChange(data)}
          onSelected={() => handleSelect("member_name")}
        />
        <EditorFieldText
          name="peringkat_name"
          data={fields?.["peringkat_name"]}
          selected={isSelected("peringkat_name")}
          onChange={(data) => onChange(data)}
          onSelected={() => handleSelect("peringkat_name")}
        />

        <EditorFieldText
          name="kategori_name"
          data={fields?.["kategori_name"]}
          selected={isSelected("kategori_name")}
          onChange={(data) => onChange(data)}
          onSelected={() => handleSelect("kategori_name")}
        />
      </div>
    </div>
  );
}
