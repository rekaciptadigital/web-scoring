import * as React from "react";
import EditorObjectText from "./EditorObjectText";

export default function EditorCanvas({ data, onChange, currentObject, onSelect }) {
  const { backgroundUrl, backgroundPreviewUrl, fields } = data;

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
    <div>
      <svg width="100%" height="auto" viewBox="0 0 1280 908" xmlns="http://www.w3.org/2000/svg">
        {/* Image background sertifikat */}
        <svg
          id="certificateBgCanvas"
          width="1280"
          height="908"
          viewBox="0 0 1280 908"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => handleDeselect()}
        >
          {getBackgroundImage() ? (
            <image
              href={getBackgroundImage()}
              x="0"
              y="0"
              height="100%"
              width="100%"
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <rect x="0" y="0" height="100%" width="100%" />
          )}
        </svg>

        {/* "Layer" teks */}
        <svg
          id="certificateTextLayer"
          width="1280"
          height="908"
          viewBox="0 0 1280 908"
          xmlns="http://www.w3.org/2000/svg"
        >
          <EditorObjectText
            name="member_name"
            data={fields?.["member_name"]}
            selected={isSelected("member_name")}
            onSelected={() => handleSelect("member_name")}
            onChange={(data) => onChange(data)}
          />
          <EditorObjectText
            name="peringkat_name"
            data={fields?.["peringkat_name"]}
            selected={isSelected("peringkat_name")}
            onSelected={() => handleSelect("peringkat_name")}
            onChange={(data) => onChange(data)}
          />
          <EditorObjectText
            name="kategori_name"
            data={fields?.["kategori_name"]}
            selected={isSelected("kategori_name")}
            onSelected={() => handleSelect("kategori_name")}
            onChange={(data) => onChange(data)}
          />
        </svg>
      </svg>
    </div>
  );
}
