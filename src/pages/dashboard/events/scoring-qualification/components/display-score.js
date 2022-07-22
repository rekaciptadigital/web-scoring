import * as React from "react";
import styled from "styled-components";

const optionsScoreNumbers = ["", "m", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "x"].map((value) => ({
  value,
  label: !value ? "-" : isNaN(value) ? value.toUpperCase() : value,
}));

function DisplayScore({ value }) {
  const covertedValueType = _convertScoreValueType(value);
  const selectedOption = _getOptionFromValue(covertedValueType);
  return (
    <SelectContainer>
      <Score>{selectedOption?.label || "-"}</Score>
    </SelectContainer>
  );
}

/* ================================== */
// styles

const SelectContainer = styled.div`
  min-width: 3.25rem;
  max-width: 4rem;
`;

const Score = styled.div`
  padding: 0.25rem 0.25rem;
  border-radius: 0.25rem;
  text-align: center;
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

export { DisplayScore };
