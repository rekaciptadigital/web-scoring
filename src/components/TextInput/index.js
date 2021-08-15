import React from "react";
import { Input, InputGroup, Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const TextInput = ({
  id = stringUtil.createRandom(),
  label,
  value = "",
  onChange = null,
  accessoryRight,
}) => {
  const handleChange = () => {
    if (onChange) onChange();
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <Input
          type="text"
          className="form-control"
          id={id}
          onChange={() => handleChange()}
          value={value}
        />
        {accessoryRight}
      </InputGroup>
    </div>
  );
};

export default TextInput;
