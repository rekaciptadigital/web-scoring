import * as React from "react";
import _ from "lodash";
import moment from "moment";
import stringUtil from "utils/stringUtil";
import { useFieldValidation } from "utils/hooks/field-validation";

import { InputGroup, Label } from "reactstrap";
import Flatpickr from "react-flatpickr";

import "flatpickr/dist/themes/material_blue.css";

const DatetimeInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange = null,
  disabled,
  readOnly,
}) => {
  const { errors, handleFieldValidation } = useFieldValidation(name);

  const handleChange = (e) => {
    const datetime = moment(new Date(e)).format("YYYY-MM-DD H:mm:ss");
    if (onChange)
      onChange({
        key: name,
        value: datetime,
      });
  };

  const handleClose = (value) => {
    handleFieldValidation(value);
  };

  return (
    <div className="datetime-input">
      {label && <Label htmlFor={id}>{label}</Label>}

      <InputGroup>
        <Flatpickr
          className={`form-control d-block ${_.get(errors, name) ? "is-invalid" : ""}`}
          placeholder="Pilih Tanggal & Jam"
          options={{
            enableTime: true,
            altInput: true,
            altFormat: "d/m/Y H:i:ss",
            dateFormat: "Y-m-d H:i:ss",
          }}
          value={value}
          onChange={(e) => handleChange(e)}
          onClose={handleClose}
          disabled={disabled}
          readOnly={readOnly}
        />
        <div className="input-group-append">
          <span className="input-group-text">
            <i className="mdi mdi-clock-outline" />
          </span>
        </div>
      </InputGroup>

      {_.get(errors, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default DatetimeInput;
