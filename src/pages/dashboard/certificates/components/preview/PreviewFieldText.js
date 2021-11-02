import * as React from "react";

const previewTexts = {
  member_name: "Michaelangelo",
  peringkat_name: "Peserta Lomba",
  kategori_name: "Barebow 50m",
};

export default function PreviewFieldText({ name, data = {} }) {
  const { y, fontFamily, fontSize, color, fontWeight } = data;
  const divRef = React.useRef(null);
  const [currentOffsetWidth, setCurrentOffsetWidth] = React.useState(0);
  const placeholderString = previewTexts[name];

  React.useEffect(() => {
    setCurrentOffsetWidth(divRef.current?.offsetWidth);
  }, []);

  return (
    <div
      ref={divRef}
      style={{
        position: "absolute",
        top: 0,
        left: 1280 / 2 - currentOffsetWidth / 2 || 0,
        fontSize: fontSize || 60,
        color: color || undefined,
        transform: `translate(0px, ${y}px)`,
        fontFamily: fontFamily || undefined,
        fontWeight: fontWeight || "normal",
      }}
    >
      {placeholderString}
    </div>
  );
}
