import * as React from "react";
import { useEditor, A4, A5, A6 } from "../contexts/editor-data";
import { SelectSetting, getOptionFromValue } from "./select-settings";

const sizeOptions = [
  { value: A4, label: "A4 (21 cm x 29,7 cm)" },
  { value: A5, label: "A5 (14,8 cm x 21 cm)" },
  { value: A6, label: "A6 (10,5 cm x 14,8 cm)" },
];

function SelectPaperSize() {
  const { isLoading, data, setPaperSize } = useEditor();
  return (
    <SelectSetting
      placeholder="Pilih ukuran kertas"
      options={sizeOptions}
      value={getOptionFromValue(sizeOptions, data.paperSize)}
      onChange={(option) => setPaperSize(option.value)}
      disabled={isLoading}
    />
  );
}

export { SelectPaperSize };
