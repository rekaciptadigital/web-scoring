import * as React from "react";

import Select from "react-select";

const optionsScoreNumbers = [14, 16, 18, 20, 21, 24, 27, 28, 30, 32, 36, 40, 42, 46].map(
  (value) => ({ value: value, label: value })
);

function SelectFontSize() {
  const selectedOption = _getOptionFromValue(14);
  return (
    <Select
      placeholder="-"
      styles={customSelectStyles}
      // onChange={handleChange}
      // onFocus={handleFocus}
      value={selectedOption}
      options={optionsScoreNumbers}
      menuPlacement="top"
      // noOptionsMessage={handleNoOption}
    />
  );
}

/* ================================== */
// styles

const customSelectStyles = {
  container: (provided) => ({
    ...provided,
    minWidth: "5rem",
  }),
  control: (provided) => ({
    ...provided,
    // minHeight: undefined,
  }),
  singleValue: (provided) => ({
    ...provided,
    textTransform: "uppercase",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 0 0 0.75rem",
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

export { SelectFontSize };
