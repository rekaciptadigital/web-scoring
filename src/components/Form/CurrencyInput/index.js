import * as React from "react";
import _ from "lodash";
import stringUtil from "utils/stringUtil";
import { useFieldValidation } from "utils/hooks/field-validation";

import { Col, Label } from "reactstrap";
import CurrencyFormat from "react-currency-format";

const CurrencyInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  horizontal = false,
  disabled = false,
  readOnly,
}) => {
  const { errors, handleFieldValidation } = useFieldValidation(name);

  const handleChange = (ev) => {
    if (onChange) {
      onChange({
        key: name,
        value: !isNaN(ev.floatValue) ? ev.floatValue : undefined,
      });
    }
  };

  const handleBlur = () => {
    handleFieldValidation(value);
  };

  if (horizontal) {
    return (
      <div className="row">
        {label && (
          <Label htmlFor="horizontal-Input" className="col-sm-6 col-form-label">
            {label}
          </Label>
        )}
        <Col sm={6}>
          <CurrencyFormat
            id={id}
            displayType={"input"}
            prefix={"Rp "}
            thousandSeparator={"."}
            decimalSeparator={","}
            value={value || ""} // fallback string kosongan kalau value === undefined
            onValueChange={(e) => handleChange(e)}
            onBlur={handleBlur}
            className={`form-control ${_.get(errors, name) ? "is-invalid" : ""}`}
            disabled={disabled}
            readOnly={readOnly}
          />
          {_.get(errors, name)?.map((message) => (
            <div className="invalid-feedback" key={message}>
              {message}
            </div>
          ))}
        </Col>
      </div>
    );
  }

  return (
    <div>
      {label && <Label>{label}</Label>}
      <CurrencyFormat
        id={id}
        displayType={"input"}
        prefix={"Rp "}
        thousandSeparator={"."}
        decimalSeparator={","}
        value={value || ""} // fallback string kosongan kalau value === undefined
        onValueChange={(e) => handleChange(e)}
        onBlur={handleBlur}
        className={`form-control ${_.get(errors, name) ? "is-invalid" : ""}`}
        disabled={disabled}
      />
      {_.get(errors, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default CurrencyInput;
