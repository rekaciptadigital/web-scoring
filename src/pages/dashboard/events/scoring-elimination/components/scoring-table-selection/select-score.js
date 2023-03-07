import * as React from "react";
import styled from "styled-components";

import ReactSelect from "react-select";

const optionsScoreNumbers = ["", "m", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "x"].map(
  (value) => ({
    value,
    label: !value ? "-" : isNaN(value) ? value.toUpperCase() : value,
    // label: isNaN(value) ? value.toUpperCase() : value,
  })
);

const Select = React.memo(ReactSelect);

function SelectScore({
  name,
  value,
  onChange,
  onInputChange,
  isFocus,
  onFocus,
}) {
  const covertedValueType = _convertScoreValueType(value);
  const selectedOption = _getOptionFromValue(covertedValueType);
  const refSelect = React.useRef(null);

  React.useEffect(() => {
    if (!isFocus) {
      return;
    }
    refSelect.current?.focus();
  }, [isFocus]);

  const handleChange = React.useCallback(
    (option) => {
      if (option.value === covertedValueType) {
        return;
      }
      onChange?.(option.value);
    },
    [covertedValueType]
  );

  const handleNoOption = React.useCallback(() => "-", []);
  const handleFocus = React.useCallback(onFocus, []);
  const handleInputChange = React.useCallback(onInputChange, []);

  return (
    <SelectContainer>
      <Select
        name={name}
        placeholder="-"
        styles={customSelectStyles}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onFocus={handleFocus}
        value={selectedOption}
        options={optionsScoreNumbers}
        noOptionsMessage={handleNoOption}
        ref={refSelect}
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
