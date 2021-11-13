import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useFieldValidation } from "utils/hooks/field-validation";

import { Label } from "reactstrap";

const RadioButtonInput = ({
  name,
  label,
  options = [{ id: 1, label: "Default" }],
  onChange,
  value,
  valueOnly = false,
  disabled,
  readOnly,
  checked,
}) => {
  const [checkedOption, setCheckedOption] = useState();
  const { errors, handleFieldValidation } = useFieldValidation(name);

  useEffect(() => {
    const option = _.find(options, ["id", value]);
    setCheckedOption(option);
  }, []);

  const handleChange = (ev, option) => {
    setCheckedOption(option);
    if (onChange) {
      onChange({
        key: name,
        value: valueOnly ? option.id : option,
      });
    }
    handleFieldValidation(valueOnly ? option.id : option);
  };

  const handleBlur = () => {
    handleFieldValidation(value);
  };

  const Button = ({ id, label }) => (
    <>
      <input
        type="radio"
        className="btn-check"
        name={name}
        id={id}
        autoComplete="off"
        onChange={(e) => handleChange(e, { id, label })}
        onBlur={handleBlur}
        checked={id === checkedOption?.id || checked}
        disabled={disabled}
        readOnly={readOnly}
      />
      <label
        className={`btn ${_.get(errors, name) ? "btn-outline-danger" : "btn-outline-primary"}`}
        htmlFor={id}
      >
        {label}
      </label>
    </>
  );

  return (
    <div className="radio-button-input">
      {label && <Label className="form-label">{label}</Label>}
      <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
        {options.map((option) => (
          <Button id={option.id} key={option.id} label={option.label} />
        ))}
      </div>
      {_.get(errors, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default RadioButtonInput;
