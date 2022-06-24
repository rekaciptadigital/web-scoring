import * as React from "react";
import { useEditor } from "../contexts/editor-data";

import { SelectSetting } from "./select-settings";

import { idCardFields } from "constants/index";

const {
  LABEL_PLAYER_NAME,
  LABEL_GENDER,
  LABEL_LOCATION_AND_DATE,
  LABEL_CATEGORY,
  LABEL_CLUB_MEMBER,
  LABEL_STATUS_EVENT,
  LABEL_BUDREST,
  LABEL_QR_CODE,
  LABEL_AVATAR,
} = idCardFields;

const FIELD_LABELS = {
  [LABEL_PLAYER_NAME]: "Nama Peserta",
  [LABEL_GENDER]: "Jenis Kelamin",
  [LABEL_LOCATION_AND_DATE]: "Tempat & Tanggal Pertandingan",
  [LABEL_CATEGORY]: "Kategori Pertandingan",
  [LABEL_CLUB_MEMBER]: "Asal Klub",
  [LABEL_STATUS_EVENT]: "Status (Peserta/Official)",
  [LABEL_BUDREST]: "Nomor Bantalan",
  [LABEL_QR_CODE]: "QR Code",
  [LABEL_AVATAR]: "Foto Profil",
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
