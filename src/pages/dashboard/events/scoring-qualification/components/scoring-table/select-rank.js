import * as React from "react";

import Select from "react-select";

function SelectRank({
  placeholder,
  options,
  value,
  isMulti,
  isClearable,
  onChange,
  onFocus,
  noOptionsMessage,
  disabled,
}) {
  return (
    <Select
      placeholder={placeholder}
      noOptionsMessage={() => noOptionsMessage}
      styles={customSelectStyles}
      options={options}
      value={value}
      isMulti={isMulti}
      isClearable={isClearable}
      onChange={onChange}
      onFocus={onFocus}
      isDisabled={disabled}
    />
  );
}

/* ================================== */
// styles

const customSelectStyles = {
  container: (provided) => ({
    ...provided,
    flexGrow: "1",
    padding: '5px',
    width: '70px'
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

function getOptionByValue(options, value) {
  if (!value) {
    return options?.[0] || null;
  }
  return options.find((option) => option.value === value);
}

export { SelectRank, getOptionByValue, customSelectStyles };
