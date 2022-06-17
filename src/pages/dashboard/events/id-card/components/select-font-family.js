import * as React from "react";

import Select from "react-select";

const optionsScoreNumbers = ["Nama Font"].map((value) => ({ value: value, label: value }));

function SelectFontFamily() {
  const selectedOption = _getOptionFromValue("Nama Font");
  return (
    <Select
      placeholder="-"
      styles={customSelectStyles}
      // onChange={handleChange}
      // onFocus={handleFocus}
      value={selectedOption}
      options={optionsScoreNumbers}
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
  return optionsScoreNumbers.find((option) => option.value === value);
}

export { SelectFontFamily };
