import React, { useEffect, useState } from "react";
import _ from "lodash";
import stringUtil from "utils/stringUtil";
import { useFieldValidation } from "utils/hooks/field-validation";

import { Label } from "reactstrap";
import Select from "react-select";

const SelectInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  style,
  value,
  onChange,
  options = [],
  disabled,
  readOnly,
  placeholder,
}) => {
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectValue, setSelectValue] = useState(null);
  const { errors, handleFieldValidation } = useFieldValidation(name);

  const handleChange = (e) => {
    if (onChange)
      onChange({
        key: name,
        value: e,
      });
  };

  const handleBlur = () => {
    handleFieldValidation(value?.value);
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
      setSelectValue(null);
    }
  }, [value]);

  return (
    <div style={style}>
      {label && <Label>{label}</Label>}
      <Select
        maxMenuHeight={220}
        id={id}
        value={selectValue}
        onChange={handleChange}
        onBlur={handleBlur}
        options={selectOptions}
        classNamePrefix="select2-selection"
        className={`${errors?.[name] ? "is-invalid" : ""}`}
        isDisabled={disabled || readOnly}
        placeholder={placeholder}
      />
      {_.get(errors, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default SelectInput;
