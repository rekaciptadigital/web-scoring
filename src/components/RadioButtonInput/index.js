import React from "react";
import { Label } from "reactstrap";

const RadioButtonInput = ({
  label,
  options = [
    {
      id: 1,
      label: "Default",
    },
  ],
}) => {
  const Button = ({ id, label }) => (
    <>
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id={id}
        autoComplete="off"
        defaultChecked
      />
      <label className="btn btn-secondary" htmlFor={id}>
        {label}
      </label>
    </>
  );
  return (
    <div>
      {label && <Label className="form-label">{label}</Label>}
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        {options.map(option => (
          <Button id={option.id} key={option.id} label={option.label} />
        ))}
      </div>
    </div>
  );
};

export default RadioButtonInput;
