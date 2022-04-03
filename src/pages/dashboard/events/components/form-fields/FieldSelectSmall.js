import * as React from "react";
import styled from "styled-components";

import Select from "react-select";

function FieldSelectSmall({
  children,
  label,
  name,
  required,
  placeholder,
  emptyMessage = "Pilihan kosong",
  options,
  value = null,
  onChange,
  errors,
  disabled,
}) {
  return (
    <FieldSelectWrapper>
      <label className="field-label">
        {children || label}
        {required && <span className="field-required">*</span>}
      </label>
      <Select
        styles={computeCustomStylesWithValidation(errors)}
        name={name}
        placeholder={placeholder || label}
        noOptionsMessage={() => emptyMessage}
        options={options}
        value={value}
        onChange={onChange}
        isDisabled={disabled}
      />
    </FieldSelectWrapper>
  );
}

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
  control: (provided, state) => ({
    ...provided,
    minHeight: undefined,
    backgroundColor: state.isDisabled ? "#eff2f7" : "#ffffff",
    borderColor: state.isDisabled ? "rgb(206, 212, 218)" : "#ced4da",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "8px 12px",
  }),
  input: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 12,
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 12,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 12,
    opacity: 0.6,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 7,
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

export default FieldSelectSmall;
