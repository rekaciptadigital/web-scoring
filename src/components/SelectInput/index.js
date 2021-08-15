import React from "react";
import { Label } from "reactstrap";
import Select from "react-select";
import stringUtil from "utils/stringUtil";

const SelectInput = ({
  id = stringUtil.createRandom(),
  label,
  value = "",
  onChange = null,
  options = [],
}) => {
  const handleChange = () => {
    if (onChange) onChange();
  };
  return (
    <div>
      {label && <Label>{label}</Label>}
      <Select
        id={id}
        value={value}
        onChange={() => {
          handleChange();
        }}
        options={options}
        classNamePrefix="select2-selection"
      />
    </div>
  );
};

export default SelectInput;
