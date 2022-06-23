import * as React from "react";
import styled from "styled-components";

import Select from "react-select";

const optionsScoreNumbers = ["", "m", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "x"].map((value) => ({
  value,
  label: !value ? "-" : isNaN(value) ? value.toUpperCase() : value,
}));

function SelectScore({ name, value, onChange, onInputChange, isFocus, onFocus }) {
  const covertedValueType = _convertScoreValueType(value);
  const selectedOption = _getOptionFromValue(covertedValueType);
  const refSelect = React.useRef(null);

  React.useEffect(() => {
    if (!isFocus) {
      return;
    }
    refSelect.current?.focus();
  }, [isFocus]);

  const handleChange = (option) => {
    if (option.value === covertedValueType) {
      return;
    }
    onChange?.(option.value);
  };

  const handleNoOption = React.useCallback(() => "-", []);

  return (
    <SelectContainer>
      <Select
        ref={refSelect}
        name={name}
        placeholder="-"
        styles={customSelectStyles}
        onChange={handleChange}
        value={selectedOption}
        options={optionsScoreNumbers}
        noOptionsMessage={handleNoOption}
        onInputChange={onInputChange}
        onFocus={onFocus}
      />
    </SelectContainer>
  );
}

/* ================================== */
// styles

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: undefined,
  }),
  singleValue: (provided) => ({
    ...provided,
    textTransform: "uppercase",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 0 0 0.25rem",
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
  }),
};

const SelectContainer = styled.div`
  min-width: 3.25rem;
  max-width: 4rem;
`;

/* =============================== */
// utils

function _convertScoreValueType(inputValue) {
  if (!inputValue || inputValue === "-") {
    return "-";
  }
  if (["m", "x"].indexOf(inputValue.toLowerCase?.()) >= 0) {
    return inputValue;
  }
  return Number(inputValue);
}

function _getOptionFromValue(value) {
  return optionsScoreNumbers.find((option) => option.value === value);
}

export { SelectScore };
