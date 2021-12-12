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
  control: (provided, { isFocused }) => ({
    ...provided,
    minHeight: 36,
    backgroundColor: "var(--ma-blue)",
    borderColor: isFocused ? "#2684ff" : "var(--ma-blue)",
    ":hover": {
      borderColor: "#2684ff",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "8px 12px",
  }),
  input: (provided) => ({
    ...provided,
    color: "#ffffff",
    fontSize: 12,
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#ffffff",
    fontSize: 12,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#ffffff",
    fontSize: 12,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 7,
    color: "#ffffff",
    ":hover": {
      color: "#ffffff",
    },
  }),
};

// TODO: tambah beberapa props berikut:
/*
   - disabled
   - ...
 */
function FieldSelectKelas({
  children,
  label,
  name,
  placeholder,
  required,
  options,
  value,
  onChange,
}) {
  return (
    <FieldSelectWrapper>
      <label className="field-label">
        {children || label}
        {required && <span className="field-required">*</span>}
      </label>
      <Select
        styles={customSelectStyles}
        name={name}
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange}
      />
    </FieldSelectWrapper>
  );
}

export default FieldSelectKelas;
