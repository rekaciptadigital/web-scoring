import * as React from "react";

// eslint-disable-next-line no-unused-vars
import { SelectSetting, getOptionFromValue } from "./select-settings";

const dataOptions = [
  { value: "player_name", label: "Nama Peserta" },
  { value: "location_and_date", label: "Tempat & Tanggal Pertandingan" },
  { value: "category", label: "Kategori Pertandingan" },
  { value: "club_member", label: "Asal Klub" },
  { value: "status_event", label: "Status (Peserta/Official)" },
];

// eslint-disable-next-line no-unused-vars
function SelectVisibleData({ value }) {
  return (
    <SelectSetting
      isMulti
      isClearable={false}
      settingOptions={dataOptions}
      placeholder="Pilih data yang akan ditampilkan"
      noOptionsMessage="Semua data telah ditampilkan"
      value={dataOptions}
    />
  );
}

export { SelectVisibleData };
