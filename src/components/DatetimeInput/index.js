import React from "react";
import { InputGroup, Label } from "reactstrap";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import stringUtil from "utils/stringUtil";

const DatetimeInput = ({
  id = stringUtil.createRandom(),
  label,
  value,
  onChange = null,
}) => {
  const handleChange = () => {
    if (onChange) onChange();
  };

  return (
    <div className="datetime-input">
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <Flatpickr
          className="form-control d-block"
          placeholder="Tanggal/Bulan/Tahun"
          options={{
            altInput: true,
            altFormat: "d/m/Y",
            dateFormat: "Y-m-d",
          }}
          value={value}
          onChange={() => handleChange()}
        />
        <Flatpickr
          className="form-control d-block"
          placeholder="Pilih Waktu"
          options={{
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
          }}
        />
        <div className="input-group-append">
          <span className="input-group-text">
            <i className="mdi mdi-clock-outline" />
          </span>
        </div>
      </InputGroup>
    </div>
  );
};

export default DatetimeInput;
