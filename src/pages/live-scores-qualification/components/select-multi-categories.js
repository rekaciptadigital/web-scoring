import * as React from "react";
import { useDisplaySettings } from "../contexts/display-settings";

import { SelectSetting } from "./select-settings";

function SelectCategories() {
  const { categories } = useDisplaySettings();
  const options = categories.map((label) => ({ value: label, label: label }));
  return (
    <SelectSetting
      isMulti
      placeholder="Pilih kategori yang akan ditampilkan"
      noOptionsMessage="Semua kategori telah ditampilkan"
      // value={isLoading ? null : values}
      // TODO: value dari kategori yang dipilih
      value={options}
      options={options}
      onChange={(opts) => {
        console.log(opts);
      }}
    />
  );
}

export { SelectCategories };
