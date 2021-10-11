import React, { useEffect, useState } from "react";
import _ from "lodash";
import stringUtil from "utils/stringUtil";

import { Label } from "reactstrap";
import Select from "react-select";

const SelectInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  options = [],
  disabled,
  readOnly,
  placeholder,
  validation,
}) => {
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectValue, setSelectValue] = useState(null);
  const [error, setError] = React.useState(null);

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
      setSelectValue(null);
    }
  }, [value]);

  const handleBlur = () => {
    if (validation?.required) {
      if (!selectValue) {
        setError((errors) => {
          return {
            ...errors,
            [name]: [validation.required],
          };
        });
      } else {
        setError((errors) => {
          const updatedErrors = { ...errors };
          delete updatedErrors[name];
          return updatedErrors;
        });
      }
    }
  };

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Select
        maxMenuHeight={220}
        id={id}
        value={selectValue}
        onChange={handleChange}
        onBlur={handleBlur}
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
