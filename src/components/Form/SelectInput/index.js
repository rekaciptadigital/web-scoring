import React, { useEffect, useState } from "react";
import { Label } from "reactstrap";
import Select from "react-select";
import stringUtil from "utils/stringUtil";
import _ from "lodash";

const SelectInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  options = [],
  error,
  disabled,
  readOnly,
}) => {
  const [selectOptions, setSelectOptions] = useState([]);
  const handleChange = e => {
    if (onChange)
      onChange({
        key: name,
        value: e,
      });
  };

  useEffect(() => {
    const newSelectOptions = options.map(option => {
      return {
        id: option.value || option.id,
        value: option.value || option.id,
        label: option.label,
      };
    });
    setSelectOptions(newSelectOptions);
  }, []);

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Select
        id={id}
        value={value}
        onChange={handleChange}
        options={selectOptions}
        classNamePrefix="select2-selection"
        className={`${error?.[name] ? "is-invalid" : ""}`}
        isDisabled={disabled || readOnly}
      />
      {_.get(error, name)?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default SelectInput;
