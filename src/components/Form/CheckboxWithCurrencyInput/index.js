import * as React from "react";
import _ from "lodash";

import { Input, Label } from "reactstrap";
import CurrencyInput from "../CurrencyInput";

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
  const [newOptions, setNewOptions] = React.useState(() => {
    return options.map((input) => {
      const relatedValue = value.find((one) => one.id === input.id);
      return {
        ...input,
        checked: Boolean(relatedValue),
        price: relatedValue?.price,
      };
    });
  });

  const handleChange = (newOptions) => {
    if (onChange) {
      onChange({
        key: name,
        value: _.filter(newOptions, ["checked", true]),
      });
    }
  };

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

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div>
        {newOptions.map((option, index) => {
          // Supaya atribut `name` gak rancu waktu ngeset pesan error ke DOM
          const inputFieldName = `${name}.${index}.${textInputName}`;

          return (
            <div
              className={`form-check ${_.get(error, inputFieldName) ? "is-invalid" : ""}`}
              key={option.id}
              style={{ display: "inline-block", marginRight: 10 }}
            >
              {!option.fixed && (
                <Input
                  type="checkbox"
                  className="form-check-Input"
                  id={option.id}
                  onChange={(e) => handleCheck(e, index, option)}
                  name={option.id}
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
                  id={inputFieldName}
                  name={inputFieldName}
                  value={option.price}
                  onChange={(ev) => handleTextInputChange(ev, index, option)}
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
