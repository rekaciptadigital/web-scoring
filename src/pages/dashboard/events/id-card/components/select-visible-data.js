import * as React from "react";
import { useEditor } from "../contexts/editor-data";

import { SelectSetting } from "./select-settings";

const FIELD_LABELS = {
  player_name: "Nama Peserta",
  location_and_date: "Tempat & Tanggal Pertandingan",
  category: "Kategori Pertandingan",
  club_member: "Asal Klub",
  status_event: "Status (Peserta/Official)",
  photoProfile: "Foto Profil",
  qrCode: "QR Code",
};

const defaultDataOptions = _mapValuesToOptions(Object.keys(FIELD_LABELS));

function SelectVisibleData() {
  const { isLoading, visibleFieldNames, setVisibleFields, setActiveObject } = useEditor();
  const values = _mapValuesToOptions(visibleFieldNames);
  return (
    <SelectSetting
      isMulti
      isClearable={false}
      settingOptions={defaultDataOptions}
      placeholder="Pilih data yang akan ditampilkan"
      noOptionsMessage="Semua data telah ditampilkan"
      value={isLoading ? null : values}
      options={defaultDataOptions}
      onChange={(opts) => {
        setVisibleFields(opts?.map((opt) => opt.value) || []);
        setActiveObject(null);
      }}
      disabled={isLoading}
    />
  );
}

function _mapValuesToOptions(values) {
  if (!values?.length) {
    return [];
  }
  return values.map((name) => ({ value: name, label: FIELD_LABELS[name] }));
}

export { SelectVisibleData };
