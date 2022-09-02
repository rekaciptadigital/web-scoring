import * as React from "react";

import Select from "react-select";

function SelectSetting({
  placeholder,
  options,
  value,
  isMulti,
  isClearable,
  onChange,
  onFocus,
  noOptionsMessage,
  disabled,
  errors,
}) {
  return (
    <Select
      placeholder={placeholder || "Placeholder"}
      noOptionsMessage={() => noOptionsMessage}
      styles={computeCustomStylesWithValidation(errors)}
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

const computeCustomStylesWithValidation = (errors) => {
  if (errors?.length) {
    return {
      ...customSelectStyles,
      control: (provided) => ({
        ...provided,
        backgroundColor: "var(--ma-bg-negative)",
        borderColor: "var(--ma-border-negative)",
        boxShadow: "0 0 0 1px var(--ma-border-negative)",
      }),
    };
  }
  return customSelectStyles;
};

function getOptionFromValue(options, value) {
  if (!value) {
    return options?.[0] || null;
  }
  return options.find((option) => option.value === value);
}

export { SelectSetting, getOptionFromValue };
