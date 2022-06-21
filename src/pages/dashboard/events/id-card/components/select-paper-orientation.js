import * as React from "react";
import { useEditor, OR_PORTRAIT, OR_LANDSCAPE } from "../contexts/editor-data";

import { SelectSetting, getOptionFromValue } from "./select-settings";

const orientationOptions = [
  { value: OR_PORTRAIT, label: "Portrait" },
  { value: OR_LANDSCAPE, label: "Landscape" },
];

function SelectPaperOrientation() {
  const { isLoading, data, setOrientation } = useEditor();
  return (
    <SelectSetting
      options={orientationOptions}
      placeholder="Pilih orientasi kertas"
      value={getOptionFromValue(orientationOptions, data.paperOrientation)}
      onChange={(option) => setOrientation(option.value)}
      disabled={isLoading}
    />
  );
}

export { SelectPaperOrientation };
