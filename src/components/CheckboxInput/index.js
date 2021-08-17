import _ from "lodash";
import React, { useState } from "react";
import { Input, Label } from "reactstrap";

const CheckboxInput = ({
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
  error,
}) => {
  const [newOptions, setNewOptions] = useState([]);

  const handleChange = (e, option) => {
    const checked = e.target.checked;

    const modifiedOptions = [...newOptions];
    if (checked) {
      modifiedOptions.push(option);
    } else {
      const index = _.findIndex(modifiedOptions, ["id", option.id]);
      modifiedOptions.splice(index, 1);
    }
    setNewOptions(modifiedOptions);
    if (onChange)
      onChange({
        key: name,
        value: setNewOptions,
      });
  };

  if (inline) {
    return (
      <div>
        {label && <Label>{label}</Label>}
        <div>
          {options.map(option => {
            return (
              <div
                className="form-check"
                key={option.id}
                style={{ display: "inline-block", marginRight: 10 }}
              >
                <Input
                  type="checkbox"
                  className="form-check-Input"
                  id={option.id}
                  onChange={e => handleChange(e, option)}
                  name={name}
                />
                <Label className="form-check-label" htmlFor={option.id}>
                  {option.label}
                </Label>
              </div>
            );
          })}
        </div>
        {error?.[name]?.map(message => (
          <div className="invalid-feedback" key={message}>
            {message}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      <Label>{label}</Label>
      {options.map(option => {
        return (
          <div className="form-check" key={option.id}>
            <Input
              type="checkbox"
              className="form-check-Input"
              id={option.id}
              onChange={e => handleChange(e)}
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

export default CheckboxInput;
