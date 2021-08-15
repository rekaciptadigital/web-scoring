import React from "react";
import { Input, Label } from "reactstrap";

const RadioInput = ({
  name,
  label = "Checkbox Input",
  options = [
    {
      id: 1,
      label: "Default",
    },
  ],
  onChange = null,
  inline = false,
}) => {
  const handleChange = () => {
    const newOptions = options;
    if (onChange) onChange(newOptions);
  };

  if (inline) {
    return (
      <div>
        <Label>{label}</Label>

        <div>
          {options.map(option => {
            return (
              <div className="form-check form-radio-primary" key={option.id} style={{display: "inline-block", marginRight: 10}}>
                <Input
                  type="radio"
                  className="form-check-Input"
                  id={option.id}
                  onChange={e => handleChange(e)}
                  name={name}
                />
                <Label className="form-check-label" htmlFor={option.id}>
                  {option.label}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div>
      <Label>{label}</Label>
      {options.map(option => {
        return (
          <div className="form-check form-radio-primary" key={option.id}>
            <Input
              type="radio"
              className="form-check-Input"
              id={option.id}
              onChange={e => handleChange(e)}
              name={name}
            />
            <Label className="form-check-label" htmlFor={option.id}>
              {option.label}
            </Label>
          </div>
        );
      })}
    </div>
  );
};

export default RadioInput;
