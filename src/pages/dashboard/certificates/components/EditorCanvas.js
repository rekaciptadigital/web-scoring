import * as React from "react";
import EditorObjectText from "./EditorObjectText";

import mockSertifBg from "../../../../assets/images/mock-sertif.png";

export default function EditorCanvas({ data, onChange, currentObject, onSelect }) {
  const { fields } = data;

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
          <image href={mockSertifBg} x="0" y="0" height="100%" width="100%" />
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
            selected={currentObject?.name === "member_name"}
            onSelected={() => handleSelect("member_name")}
            onChange={(data) => onChange(data)}
          />
          <EditorObjectText
            name="peringkat_name"
            data={fields?.["peringkat_name"]}
            selected={currentObject?.name === "peringkat_name"}
            onSelected={() => handleSelect("peringkat_name")}
            onChange={(data) => onChange(data)}
          />
          <EditorObjectText
            name="kategori_name"
            data={fields?.["kategori_name"]}
            selected={currentObject?.name === "kategori_name"}
            onSelected={() => handleSelect("kategori_name")}
            onChange={(data) => onChange(data)}
          />
        </svg>
      </svg>
    </div>
  );
}
