import * as React from "react";
import styled from "styled-components";
import CurrencyFormat from "react-currency-format";

const FieldPriceWrapper = styled.div`
  .field-price-label {
    display: inline-block;
    width: 100%;
    color: var(--ma-gray-600);
    font-size: 12px;
    font-weight: normal;
    margin-bottom: 4px;
  }

  .field-group-price {
    position: relative;
    display: flex;
    width: 100%;

    .field-price-currency-symbol {
      position: absolute;
      top: -1px;
      bottom: -1px;
      left: -1px;

      display: flex;
      align-items: center;

      padding: 8px 12px;
      padding-left: 11px;
    }

    .field-price-input {
      display: block;
      width: 100%;
      padding: 8px 12px;
      padding-left: 36px;
      border-radius: 0.25rem;
      border: 1px solid #ced4da;

      background-color: #fff;
      background-clip: padding-box;

      color: #6a7187;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;

      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

      &::placeholder {
        opacity: 0.6;
        color: #6a7187;
      }

      &:focus {
        outline: 0;
        border-color: #2684ff;
        box-shadow: 0 0 0 1px #2684ff;
      }

      &:disabled,
      &[readonly] {
        opacity: 1;
        background-color: #eff2f7;
      }
    }
  }
`;

function FieldInputPrice({ children, label, name, disabled, value, onChange }) {
  const fieldID = name ? `field-price-${name}` : undefined;

  const handleChange = (ev) => {
    onChange?.(ev.floatValue || "");
  };

  return (
    <FieldPriceWrapper>
      <label className="field-price-label" htmlFor={fieldID}>
        {children || label}
      </label>
      <div className="field-group-price">
        <span className="field-price-currency-symbol">Rp</span>
        <CurrencyFormat
          displayType={"input"}
          className="field-price-input"
          id={fieldID}
          name={name}
          value={value || ""}
          onValueChange={handleChange}
          placeholder="0,00"
          disabled={disabled}
          thousandSeparator={"."}
          decimalSeparator={","}
          decimalScale={2}
          fixedDecimalScale
        />
      </div>
    </FieldPriceWrapper>
  );
}

export default FieldInputPrice;
