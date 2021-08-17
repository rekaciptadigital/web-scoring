import React from "react";
import { Input, InputGroup, Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const TextInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  accessoryRight,
  error,
}) => {
  const handleChange = e => {
    if (onChange)
      onChange({
        key: name,
        value: e.target.value,
      });
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <Input
          type="text"
          className="form-control"
          id={id}
          onChange={handleChange}
          value={value}
          placeholder={label}
        />
        {accessoryRight}
      </InputGroup>
      {error?.[name]?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default TextInput;
