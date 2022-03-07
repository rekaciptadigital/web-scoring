import * as React from "react";
import styled from "styled-components";
import Select from "react-select";

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

const computeCustomStylesWithValidation = (errors) => {
  if (errors?.length) {
    return {
      ...customSelectStyles,
      control: (provided) => ({
        ...provided,
        border: "solid 1px var(--ma-red)",
      }),
    };
  }
  return customSelectStyles;
};

function FieldSelectCategory({
  name,
  placeholder = "Pilih Kategori",
  options = [],
  isOptionDisabled,
  value = { label: "Barebow", value: "Barebow" },
  onChange,
  errors,
  disabled,
}) {
  return (
    <FieldSelectWrapper>
      <Select
        styles={computeCustomStylesWithValidation(errors)}
        name={name}
        placeholder={placeholder}
        options={options}
        isOptionDisabled={isOptionDisabled}
        value={value}
        onChange={onChange}
        isDisabled={disabled}
      />
    </FieldSelectWrapper>
  );
}

export default FieldSelectCategory;
