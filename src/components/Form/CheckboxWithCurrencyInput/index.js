import CurrencyInput from "../CurrencyInput";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";

const CheckboxWithCurrencyInput = ({
  name,
  label,
  options = [],
  onChange,
  error,
  disabled,
  readOnly,
  value = [],
  textInputName,
}) => {
  const [newOptions, setNewOptions] = useState([]);

  useEffect(() => {
    const newOptions = options.map((option) => {
      const newOption = { ...option };
      if (!newOption.checked)
        newOption.checked =
          option.checked ||
          value.includes(option.id) ||
          _.findIndex(value, ["id", option.id]) != -1;
      if (!newOption[textInputName]) newOption[textInputName] = "";

      return newOption;
    });
    setNewOptions(newOptions);
  }, [options]);

  const handleCheck = (e, index, option) => {
    const checked = e.target.checked;
    const newOptionValues = [...newOptions];
    if (checked) {
      const newOption = option;
      newOption.checked = true;
      if (!newOption[textInputName]) {
        newOption[textInputName] = "";
      }
      newOptionValues[index] = newOption;
    } else {
      const newOption = option;
      newOption.checked = false;
      newOptionValues[index] = newOption;
    }
    setNewOptions(newOptionValues);
    handleChange(newOptionValues);
  };

  const handleTextInputChange = (e, index, option) => {
    const newOptionValues = [...newOptions];
    const newOption = option;
    newOption.checked = true;
    newOption[textInputName] = e.value;
    newOptionValues[index] = newOption;
    setNewOptions(newOptionValues);
    handleChange(newOptionValues);
  };

  const handleChange = (newOptions) => {
    if (onChange) {
      onChange({
        key: name,
        value: _.filter(newOptions, ["checked", true]),
      });
    }
  };

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div>
        {newOptions.map((option, index) => {
          return (
            <div
              className={`form-check ${_.get(error, name) ? "is-invalid" : ""}`}
              key={option.id}
              style={{ display: "inline-block", marginRight: 10 }}
            >
              {!option.fixed && (
                <Input
                  type="checkbox"
                  className="form-check-Input"
                  id={option.id}
                  onChange={(e) => handleCheck(e, index, option)}
                  name={name}
                  disabled={disabled}
                  readOnly={readOnly || option.fixed}
                  checked={option.checked}
                />
              )}
              <Label className="form-check-label" htmlFor={option.id}>
                {option.label}
              </Label>
              {option.checked && (
                <CurrencyInput
                  name={textInputName}
                  onChange={(e) => handleTextInputChange(e, index, option)}
                />
              )}
            </div>
          );
        })}
      </div>
      {_.get(error, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default CheckboxWithCurrencyInput;
