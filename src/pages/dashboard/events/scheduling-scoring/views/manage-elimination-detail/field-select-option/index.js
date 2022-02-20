import * as React from "react";
import styled from "styled-components";
import Select from "react-select";

function FieldSelectOption({
  children,
  label,
  name,
  placeholder,
  required,
  options,
  value,
  onChange,
  errors,
  disabled,
}) {
  return (
    <FieldSelectWrapper>
      {(children || label) && (
        <label className="field-label">
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <Select
        styles={computeCustomStylesWithValidation(errors)}
        name={name}
        placeholder={placeholder}
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
    font-weight: normal;
    margin-bottom: 4px;

    .field-required {
      color: var(--ma-red);
    }
  }
`;

const customSelectStyles = {
  control: (provided, { isDisabled }) => ({
    ...provided,
    borderColor: "#ced4da",
    backgroundColor: isDisabled ? "#eff2f7" : provided.backgroundColor,
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "8px 12px",
  }),
  singleValue: (provided, { isDisabled }) => ({
    ...provided,
    color: isDisabled ? "#6a7187" : "var(--bs-body-color)",
    borderColor: "red",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#ced4da",
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--bs-body-color)",
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
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

export { FieldSelectOption };
