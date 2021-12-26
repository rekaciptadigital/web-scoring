import * as React from "react";
import styled from "styled-components";
import Select from "react-select";

const optionsJarak = [
  { label: "16 m", value: "16m" },
  { label: "20 m", value: "20m" },
  { label: "30 m", value: "30m" },
  { label: "40 m", value: "40m" },
  { label: "50 m", value: "50m" },
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
    minHeight: undefined,
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

function FieldSelectMultiJarak({
  children,
  label,
  name,
  required,
  placeholder,
  value = "",
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
        isMulti
        placeholder={placeholder}
        options={optionsJarak}
        value={value}
        onChange={onChange}
      />
    </FieldSelectWrapper>
  );
}

export default FieldSelectMultiJarak;
