import React, { useEffect, useState } from "react";
import { InputGroup, Label } from "reactstrap";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import stringUtil from "utils/stringUtil";
import moment from "moment";

const DatetimeInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange = null,
  error,
}) => {
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState(null);

  const handleChangeDate = e => {
    const date = moment(new Date(e)).format("YYYY-MM-DD");
    setNewDate(date);
  };
  const handleChangeTime = e => {
    const time = moment(new Date(e)).format("H:mm:ss");
    setNewTime(time);
  };

  useEffect(() => {
    if (newDate || newTime) {
      const date = newDate || moment().format("YYYY-MM-DD");
      const time = newTime || "00:00:00";
      setNewDate(date);
      setNewTime(time);
      if (onChange)
        onChange({
          key: name,
          value: `${date} ${time}`,
        });
    }
  }, [newDate, newTime]);

  useEffect(() => {
    const values = value ? value.split(" ") : [];
    if (values[0]) setNewDate(values[0]);
    if (values[1]) setNewTime(values[1]);
  }, []);

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
          value={newDate}
          onChange={e => handleChangeDate(e)}
        />
        <Flatpickr
          className="form-control d-block"
          placeholder="Pilih Waktu"
          options={{
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
          }}
          value={newTime}
          onChange={e => handleChangeTime(e)}
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
