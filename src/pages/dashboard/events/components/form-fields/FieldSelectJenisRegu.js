import * as React from "react";
import styled from "styled-components";
import Select from "react-select";

const optionsJenisRegu = [
  { label: "Individu Putra", value: "Individu Putra" },
  { label: "Individu Putri", value: "Individu Putri" },
  { label: "Beregu Putra", value: "Beregu Putra" },
  { label: "Beregu Putri", value: "Beregu Putri" },
  { label: "Beregu Campuran", value: "Beregu Campuran" },
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

function FieldSelectJenisRegu({ children, label, name, required, placeholder, value, onChange }) {
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
        options={optionsJenisRegu}
        value={value}
        onChange={onChange}
      />
    </FieldSelectWrapper>
  );
}

export default FieldSelectJenisRegu;
