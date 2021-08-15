import React from "react";
import { Input, Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const TextareaInput = ({
  id = stringUtil.createRandom(),
  label = "Text Input",
  value = "",
  onChange = null,
}) => {
  const handleChange = () => {
    if (onChange) onChange();
  };

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        type="textarea"
        id={id}
        maxLength="225"
        rows="3"
        placeholder="This textarea has a limit of 225 chars."
        value={value}
        onChange={() => handleChange()}
      />
    </div>
  );
};

export default TextareaInput;
