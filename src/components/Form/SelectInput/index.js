import _ from "lodash";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

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
  placeholder,
}) => {
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectValue, setSelectValue] = useState(null);

  const handleChange = (e) => {
    if (onChange)
      onChange({
        key: name,
        value: e,
      });
  };

  useEffect(() => {
    const newSelectOptions = options.map((option) => {
      return {
        ...option,
        id: option.value || option.id,
        value: option.value || option.id,
        label: option.label,
      };
    });
    setSelectOptions(newSelectOptions);
  }, [options]);

  useEffect(() => {
    if (value) {
      setSelectValue({
        ...value,
        id: value?.value || value?.id || value,
        value: value?.value || value?.id || value,
        label: value?.label || value,
      });
    } else {
      setSelectValue(null)
    }
  }, [value]);

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Select
        maxMenuHeight={220}
        id={id}
        value={selectValue}
        onChange={handleChange}
        options={selectOptions}
        classNamePrefix="select2-selection"
        className={`${error?.[name] ? "is-invalid" : ""}`}
        isDisabled={disabled || readOnly}
        placeholder={placeholder}
      />
      {_.get(error, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default SelectInput;
