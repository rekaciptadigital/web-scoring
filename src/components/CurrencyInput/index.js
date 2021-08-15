import React from "react";
import CurrencyFormat from "react-currency-format";
import { Col, Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const CurrencyInput = ({
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  horizontal = false,
}) => {
  const handleChange = () => {
    if (onChange) onChange();
  };
  if (horizontal) {
    return (
      <div className="row">
        <Label htmlFor="horizontal-Input" className="col-sm-6 col-form-label">
          {label}
        </Label>
        <Col sm={6}>
          <CurrencyFormat
            value={value}
            displayType={"input"}
            thousandSeparator={"."}
            prefix={"Rp "}
            onChange={() => handleChange()}
            decimalSeparator={","}
            className="form-control"
            id={id}
          />
        </Col>
      </div>
    );
  }
  return (
    <div>
      <Label>{label}</Label>
      <CurrencyFormat
        value={value}
        displayType={"input"}
        thousandSeparator={"."}
        prefix={"Rp "}
        onChange={() => handleChange()}
        decimalSeparator={","}
        className="form-control"
        id={id}
      />
    </div>
  );
};

export default CurrencyInput;
