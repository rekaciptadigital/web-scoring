import * as React from "react";

import { SelectSetting } from "./select-settings";

const sampleCategories = [
  "Compound - U-15 - 40m",
  "Compound - Umum - 50m",
  "Compound - 37+ - 50m",
  "Recurve - Umum - 70m",
  "Recurve - U-15 - 50m",
  "Barebow - Umum - 50m",
  "Nasional - Umum - 30m,40m,50m",
  "Nasional - U-15 - 30m",
  "Nasional - U-12 - 15m",
  "Nasional - U-9 - 10m",
].map((label) => ({ value: label, label: label }));

function SelectCategories() {
  return (
    <SelectSetting
      isMulti
      placeholder="Pilih kategori yang akan ditampilkan"
      noOptionsMessage="Semua kategori telah ditampilkan"
      // value={isLoading ? null : values}
      options={sampleCategories}
      // onChange={(opts) => {
      //   setVisibleFields(opts?.map((opt) => opt.value) || []);
      //   setActiveObject(null);
      // }}
    />
  );
}

export { SelectCategories };
