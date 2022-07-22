import * as React from "react";
import styled from "styled-components";

function DisplayScoreShootOff({ value }) {
  if (!value?.score && !value?.distance) {
    return null;
  }
  return (
    <SelectContainer>
      <Score>{_getOptionFromValue(value.score)?.label || "-"}</Score>
      <DistanceLabel scoreValue={_convertValueType(value.score)}>{value.distance}</DistanceLabel>
    </SelectContainer>
  );
}

function DistanceLabel({ children, distanceValue }) {
  if (!children && !distanceValue) {
    return <LabelDistanceSmall className="dimmer">&ndash;</LabelDistanceSmall>;
  }
  return <LabelDistanceSmall>{children || distanceValue} mm</LabelDistanceSmall>;
}

/* ================================== */
// styles

const SelectContainer = styled.div`
  position: relative;
  min-width: 3.25rem;
  max-width: 4rem;
`;

const Score = styled.div`
  padding: 0.25rem 0.25rem;
  border-radius: 0.25rem;
  text-align: center;
`;

const LabelDistanceSmall = styled.div`
  margin-top: 0.25rem;
  color: var(--ma-gray-400);
  font-size: 0.625rem;
  font-weight: 600;
  text-align: center;

  &.dimmer {
    color: var(--ma-gray-200);
  }
`;

/* =============================== */
// utils

const optionsScoreNumbers = ["", "m", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "x"].map((value) => ({
  value,
  label: !value ? "-" : isNaN(value) ? value.toUpperCase() : value,
}));

function _convertValueType(inputValue) {
  if (!inputValue || inputValue === "-") {
    return "";
  }
  if (["m", "x"].indexOf(inputValue.toLowerCase?.()) >= 0) {
    return inputValue;
  }
  return Number(inputValue);
}

function _getOptionFromValue(value) {
  if (!value) {
    return null;
  }
  const foundOption = optionsScoreNumbers.find(
    (option) => option.value === _convertValueType(value)
  );
  return foundOption || null;
}

export { DisplayScoreShootOff };
