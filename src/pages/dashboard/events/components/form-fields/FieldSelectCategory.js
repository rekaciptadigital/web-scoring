import * as React from "react";
import styled from "styled-components";
import Select from "react-select";

const optionsCategory = [
  { label: "Barebow", value: "Barebow" },
  { label: "Compound", value: "Compound" },
  { label: "Recurve", value: "Recurve" },
  { label: "Standard Bow", value: "Standard Bow" },
  { label: "Recurve FITA", value: "Recurve FITA" },
];

const FieldSelectWrapper = styled.div`
  .field-label {
    display: inline-block;

    color: var(--ma-gray-600);
    font-size: 12px;
    font-weight: normal;
    margin-bottom: 4px;

    .field-required {
      color: var(--ma-red);
    }
  }
`;

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "transparent",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "8px 12px",
  }),
  input: (provided) => ({
    ...provided,
    fontSize: 24,
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: 24,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 24,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 14,
    color: "var(--ma-blue)",
    ":hover": {
      color: "var(--ma-blue)",
    },
  }),
};

function FieldSelectCategory({
  name,
  placeholder = "Pilih Kategori",
  options = optionsCategory,
  isOptionDisabled,
  value = { label: "Barebow", value: "Barebow" },
  onChange,
}) {
  return (
    <FieldSelectWrapper>
      <Select
        styles={customSelectStyles}
        name={name}
        placeholder={placeholder}
        options={options}
        isOptionDisabled={isOptionDisabled}
        value={value}
        onChange={onChange}
      />
    </FieldSelectWrapper>
  );
}

export default FieldSelectCategory;
