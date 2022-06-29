import * as React from "react";
import { useDisplaySettings } from "../contexts/display-settings";

import { SelectSetting } from "./select-settings";

function SelectCategories() {
  const { categoryOptions, settingCategories, setSettingCategories } = useDisplaySettings();
  const options = categoryOptions.map((label) => ({ value: label, label: label }));
  const values = settingCategories.map((label) => ({ value: label, label: label }));
  return (
    <SelectSetting
      isMulti
      placeholder="Pilih kategori yang akan ditampilkan"
      noOptionsMessage="Semua kategori telah ditampilkan"
      value={values}
      options={options}
      onChange={(opts) => {
        if (!opts?.length) {
          setSettingCategories([]);
        } else {
          const valueList = opts.map((opt) => opt.value);
          setSettingCategories(valueList);
        }
      }}
    />
  );
}

export { SelectCategories };
