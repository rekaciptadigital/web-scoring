import * as React from "react";
import _ from "lodash";
import stringUtil from "utils/stringUtil";
import { useFieldValidation } from "utils/hooks/field-validation";

import { Input, InputGroup, Label } from "reactstrap";

const TextInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  placeholder,
  value,
  onChange,
  accessoryRight,
  readOnly,
  disabled,
}) => {
  const { errors, handleFieldValidation } = useFieldValidation(name);

  const handleChange = (e) => {
    if (onChange) {
      onChange({
        key: name,
        value: e.target.value,
      });
    }
  };

  const handleBlur = () => {
    handleFieldValidation(value);
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <Input
          type="text"
          className={`form-control ${_.get(errors, name) ? "is-invalid" : ""}`}
          id={id}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          placeholder={placeholder || label}
          readOnly={readOnly}
          disabled={disabled}
        />
        {accessoryRight}
      </InputGroup>
      {_.get(errors, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default TextInput;
