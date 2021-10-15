import * as React from "react";
import stringUtil from "utils/stringUtil";
import moment from "moment";
import _ from "lodash";
import { useFieldValidation } from "utils/hooks/field-validation";

import { InputGroup, Label } from "reactstrap";
import Flatpickr from "react-flatpickr";

import "flatpickr/dist/themes/material_blue.css";

const DateInput = ({
  name,
  placeholder,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange = null,
  disabled,
  readOnly,
  options = {},
}) => {
  const { errors, handleFieldValidation } = useFieldValidation(name);

  const handleChange = (ev) => {
    if (onChange) {
      const updatedValue = ev.length > 0 ? moment(new Date(ev)).format("Y-MM-DD") : "";
      onChange({
        key: name,
        value: updatedValue,
      });
      handleFieldValidation(updatedValue);
    }
  };

  const handleClose = () => {
    handleFieldValidation(value);
  };

  return (
    <div className="date-input">
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        <Flatpickr
          className={`form-control d-block ${_.get(errors, name) ? "is-invalid" : ""}`}
          placeholder={placeholder ? `${placeholder} (TT/BB/TTTT)` : "Tanggal/Bulan/Tahun"}
          options={{ altInput: true, altFormat: "d/m/Y", dateFormat: "Y-m-d", ...options }}
          value={value}
          onChange={(e) => handleChange(e)}
          onClose={handleClose}
          disabled={disabled}
          readOnly={readOnly}
        />
        <div className="input-group-append">
          <span className="input-group-text">
            <i className="mdi mdi-calendar-outline" />
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

export default DateInput;
