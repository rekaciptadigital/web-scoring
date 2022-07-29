import * as React from "react";
import styled from "styled-components";
import { useLocation, Link } from "react-router-dom";

import Select, { components } from "react-select";

import IconPlus from "components/ma/icons/mono/plus";

function FieldSelectClass({
  children,
  label,
  name,
  required,
  placeholder,
  emptyMessage = "Pilihan kelas tidak tersedia",
  options,
  value = null,
  onChange,
  errors,
  disabled,
}) {
  const customComponents = React.useMemo(() => ({ MenuList, Option }), []);
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
        components={customComponents}
        value={value}
        onChange={onChange}
        isDisabled={disabled}
      />
    </FieldSelectWrapper>
  );
}

function MenuList({ children, ...props }) {
  const { pathname } = useLocation();
  return (
    <components.MenuList {...props}>
      {children}
      <OptionAddClassWrapper
        tabIndex="-1"
        as={Link}
        to={{ pathname: "/dashboard/class-categories", state: { from: pathname } }}
      >
        <IconPlus size="16" /> Tambah Kelas
      </OptionAddClassWrapper>
    </components.MenuList>
  );
}

function Option({ children, data, ...props }) {
  return (
    <div title={data.description}>
      <components.Option {...props}>{children}</components.Option>
    </div>
  );
}

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

/* ============================================ */
// styles

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

const OptionAddClassWrapper = styled.div`
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 0.75rem;
  background-color: var(--ma-gray-50);

  color: var(--ma-blue);
  font-size: inherit;
  text-align: center;

  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: var(--ma-blue);
    color: #ffffff;
  }
`;

export { FieldSelectClass };
