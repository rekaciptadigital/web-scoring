import * as React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

function SelectOptions({
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

SelectOptions.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  isMulti: PropTypes.bool,
  isClearable: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  noOptionsMessage: PropTypes.string,
  disabled: PropTypes.bool,
};

SelectOptions.defaultProps = {
  placeholder: "Select...",
  isMulti: false,
  isClearable: false,
  noOptionsMessage: "No options available",
  disabled: false,
};

/* ================================== */
// styles

const customSelectStyles = {
  container: (provided) => ({
    ...provided,
    flexGrow: "1",
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

export { SelectOptions, getOptionByValue, customSelectStyles };
