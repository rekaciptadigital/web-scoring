import * as React from "react";
import styled from "styled-components";
import Select from "react-select";

const FieldSelectWrapper = styled.div`
  .field-label {
    display: inline-block;
    color: var(--ma-gray-600);
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 4px;

    .field-required {
      color: var(--ma-red);
    }
  }
`;

const customSelectStyles = {
  valueContainer: (provided) => ({
    ...provided,
    padding: "8px 12px",
  }),
  input: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 16,
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 16,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 16,
    opacity: 0.6,
  }),
};

// TODO: tambah beberapa props berikut:
/*
   - disabled
   - ...
 */
function FieldSelect({ children, label, name, placeholder, required, options, value, onChange }) {
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

export default FieldSelect;
