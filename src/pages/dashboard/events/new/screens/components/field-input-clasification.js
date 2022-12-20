import React from "react";
import { useLocation } from "react-router-dom";
import Select, { components } from "react-select";
import styled from "styled-components";
import IconPlus from "components/ma/icons/mono/plus";

const CustomSelectStyles = {
  container: (provided) => ({
    ...provided,
    flexGrow: "1",
    cursor: "pointer",
  }),
  control: (provided) => ({
    ...provided,
    cursor: "pointer",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 0 0 0.5rem",
    cursor: "pointer",
  }),
  singleValue: (provided) => ({
    ...provided,
    cursor: "pointer",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6a7187",
    opacity: 0.6,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "0 0.25rem 0 0",
    color: "var(--ma-blue)",
    cursor: "pointer",
    ":hover": {
      color: "var(--ma-blue)",
    },
  }),
};

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

function FieldInputClasification(props) {
  // const {props} =
  console.log("props:", props);
  const customComponents = React.useMemo(() => ({ MenuList, Option }), []);

  const options = [];

  const emptyMessage = "Pilihan klasifikasi tidak tersedia";

  return (
    <FieldSelectWrapper>
      <p className="fw-normal">Peserta Mendaftarkan mewakili</p>
      <Select
        styles={CustomSelectStyles}
        placeholder="Pilih klasifikasi"
        noOptionsMessage={() => emptyMessage}
        options={options}
        components={customComponents}
      />
    </FieldSelectWrapper>
  );
}

const MenuList = ({ children, ...props }) => {
  const { pathname } = useLocation();
  console.log("pathname:", pathname);
  console.log("props:", props);
  console.log("children:", children);

  return (
    <components.MenuList {...props}>
      {children}
      <OptionAddClassWrapper tabIndex="-1">
        <IconPlus size="16" />
        Tambahin
      </OptionAddClassWrapper>
    </components.MenuList>
  );
};

const Option = ({ children, data, ...props }) => {
  console.log("children:", children);
  console.log("data:", data);
  console.log("props:", props);
  return (
    // <div title={data.description}>
    //   <components.Option {...props}>{children}</components.Option>
    // </div>
    <div title="testing">
      <components.Option {...props}>halo</components.Option>
    </div>
  );
};

export default FieldInputClasification;
