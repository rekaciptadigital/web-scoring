import * as React from "react";
import styled from "styled-components";

import Select from "react-select";

import { stringUtil } from "utils";

const scoreOptions = ["m", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "x"].map((value) => ({
  value,
  label: isNaN(value) ? value.toUpperCase() : value,
}));

function getOptionFromValue(value) {
  const defaultOption = { value, label: "-" };
  return scoreOptions.find((option) => option.value === value) || defaultOption;
}

function SelectScore({ score, onChange }) {
  const formatedValue = getOptionFromValue(score);

  return (
    <SelectContainer>
      <Select
        name={stringUtil.createRandom()}
        styles={customSelectStyles}
        onChange={(option) => onChange?.(option.value)}
        defaultValue={formatedValue}
        value={formatedValue}
        options={scoreOptions}
      />
    </SelectContainer>
  );
}

// TODO: custom styling container supaya mirip figma
const customSelectStyles = {
  singleValue: (provided) => ({
    ...provided,
    textTransform: "uppercase",
  }),
};

const SelectContainer = styled.div`
  min-width: 5rem;
`;

export { SelectScore };
