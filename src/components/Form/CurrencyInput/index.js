import _ from "lodash";
import React from "react";
import CurrencyFormat from "react-currency-format";
import { Col, Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const CurrencyInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  horizontal = false,
  error,
  disabled = false,
  readOnly,
}) => {
  const handleChange = e => {
    if (onChange)
      onChange({
        key: name,
        value: e.floatValue,
      });
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
            value={value}
            displayType={"input"}
            thousandSeparator={"."}
            prefix={"Rp "}
            onValueChange={e => handleChange(e)}
            decimalSeparator={","}
            className={`form-control ${_.get(error, name) ? "is-invalid" : ""}`}
            id={id}
            disabled={disabled}
            readOnly={readOnly}
          />
          {_.get(error, name)?.map(message => (
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
        value={value}
        displayType={"input"}
        thousandSeparator={"."}
        prefix={"Rp "}
        onValueChange={e => handleChange(e)}
        decimalSeparator={","}
        className={`form-control ${_.get(error, name) ? "is-invalid" : ""}`}
        id={id}
        disabled={disabled}
      />
      {_.get(error, name)?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default CurrencyInput;
