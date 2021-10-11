import * as React from "react";
import CurrencyFormat from "react-currency-format";
import _ from "lodash";
import stringUtil from "utils/stringUtil";

import { Col, Label } from "reactstrap";

const CurrencyInput = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  horizontal = false,
  disabled = false,
  readOnly,
  validation,
}) => {
  const [error, setError] = React.useState(null);

  const handleChange = (e) => {
    if (onChange)
      onChange({
        key: name,
        value: e.floatValue,
      });
  };

  const handleBlur = (ev) => {
    if (validation?.required) {
      if (!ev.target.value) {
        setError((errors) => {
          return {
            ...errors,
            [name]: [validation.required],
          };
        });
      } else {
        setError((errors) => {
          const updatedErrors = { ...errors };
          delete updatedErrors[name];
          return updatedErrors;
        });
      }
    }
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
            onValueChange={(e) => handleChange(e)}
            onBlur={handleBlur}
            decimalSeparator={","}
            className={`form-control ${_.get(error, name) ? "is-invalid" : ""}`}
            id={id}
            disabled={disabled}
            readOnly={readOnly}
          />
          {_.get(error, name)?.map((message) => (
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
        onValueChange={(e) => handleChange(e)}
        onBlur={handleBlur}
        decimalSeparator={","}
        className={`form-control ${_.get(error, name) ? "is-invalid" : ""}`}
        id={id}
        disabled={disabled}
      />
      {_.get(error, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default CurrencyInput;
