import * as React from "react";

import Select from "react-select";

const ARIAL = "Arial, sans-serif";
const DEJAVU_SANS = "'DejaVu Sans', sans-serif";
const POPPINS = "'Poppins', sans-serif";

const optionsFontFamily = [
  { value: ARIAL, label: "Arial" },
  { value: DEJAVU_SANS, label: "DejaVu Sans" },
  { value: POPPINS, label: "Poppins" },
];

function SelectFontFamily({ fontFamily, onChange }) {
  return (
    <Select
      placeholder="-"
      styles={customSelectStyles}
      options={optionsFontFamily}
      value={_getOptionFromValue(fontFamily)}
      onChange={(opt) => onChange?.(opt.value)}
      menuPlacement="top"
    />
  );
}

/* ================================== */
// styles

const customSelectStyles = {
  container: (provided) => ({
    ...provided,
    flexGrow: "1",
  }),
  control: (provided) => ({
    ...provided,
    // TODO:
    // minHeight: undefined,
  }),
  singleValue: (provided) => ({
    ...provided,
    // TODO:
    // textTransform: "uppercase",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 0 0 0.5rem",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6a7187",
    opacity: 0.6,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "0 0.25rem 0 0",
    color: "var(--ma-blue)",
  }),
};

function _getOptionFromValue(value) {
  return optionsFontFamily.find((option) => option.value === value);
}

export { SelectFontFamily };
