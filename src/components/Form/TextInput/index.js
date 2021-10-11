import * as React from "react";
import _ from "lodash";
import stringUtil from "utils/stringUtil";

import { Input, InputGroup, Label } from "reactstrap";

const TextInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  accessoryRight,
  readOnly,
  disabled,
  validation,
}) => {
  const [error, setError] = React.useState(null);

  const handleChange = (e) => {
    if (onChange)
      onChange({
        key: name,
        value: e.target.value,
      });
  };

  const handleBlur = (ev) => {
    if (validation?.required) {
      if (!ev.target.value) {
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
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <Input
          type="text"
          className={`form-control ${_.get(error, name) ? "is-invalid" : ""}`}
          id={id}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          placeholder={label}
          readOnly={readOnly}
          disabled={disabled}
        />
        {accessoryRight}
      </InputGroup>
      {_.get(error, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default TextInput;
