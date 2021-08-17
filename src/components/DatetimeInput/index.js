import "flatpickr/dist/themes/material_blue.css";
import moment from "moment";
import React from "react";
import Flatpickr from "react-flatpickr";
import { InputGroup, Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const DatetimeInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange = null,
  error,
}) => {
  const handleChange = e => {
    const datetime = moment(new Date(e)).format("YYYY-MM-DD H:mm:ss");
    if (onChange)
      onChange({
        key: name,
        value: datetime,
      });
  };

  return (
    <div className="datetime-input">
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <Flatpickr
          className={`form-control d-block ${error?.[name] ? "is-invalid" : ""}`}
          placeholder="Pilih Tanggal & Jam"
          options={{
            enableTime: true,
            altInput: true,
            altFormat: "d/m/Y H:i:ss",
            dateFormat: "Y-m-d H:i:ss",
          }}
          value={value}
          onChange={e => handleChange(e)}
        />
        <div className="input-group-append">
          <span className="input-group-text">
            <i className="mdi mdi-clock-outline" />
          </span>
        </div>
      </InputGroup>
      {error?.[name]?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default DatetimeInput;
