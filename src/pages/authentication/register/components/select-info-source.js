import * as React from "react";

import Select from "react-select/creatable";
import { customSelectStyles } from "./select-options";

const defaultSourceOptions = ["Kerabat", "Keluarga", "Youtube", "Instagram"];
const otherOption = {
  value: "Lainnya",
  label: "Lainnya (tulis yang belum cantum)",
  disabled: true,
};

function SelectInfoSource({ value, onChange }) {
  const [optionData, setOptionData] = React.useState(defaultSourceOptions);

  const optionsInfoSource = React.useMemo(
    () => [...optionData.map((value) => ({ value: value, label: value })), otherOption],
    [optionData]
  );

  const foundOption = _getOptionByValue(optionsInfoSource, value);

  React.useEffect(() => {
    if (!value || foundOption) {
      return;
    }
    setOptionData(_createOptionsUpdater(value));
    onChange?.(value);
  }, [value, foundOption]);

  return (
    <Select
      placeholder="Pilih opsi"
      styles={customSelectStyles}
      options={optionsInfoSource}
      value={foundOption}
      onChange={(opt) => onChange?.(opt.value)}
      onCreateOption={(inputString) => {
        if (!inputString) {
          return;
        }
        setOptionData(_createOptionsUpdater(inputString));
        onChange?.(inputString);
      }}
      formatCreateLabel={(inputString) => "Lainnya: " + inputString}
      isOptionDisabled={(option) =>
        option.disabled || option.value?.toLowerCase?.() === otherOption.value
      }
    />
  );
}

/* ========================= */
// utils

const _getOptionByValue = (numberList, value) => {
  const foundOption = numberList.find((option) => option.value === value);
  return foundOption || null;
};

function _createOptionsUpdater(value) {
  return (state) => {
    const existingOptionData = state.slice(0, -1);
    const lastOption = state.slice(-1);
    return [...existingOptionData, value, lastOption];
  };
}

export { SelectInfoSource };
