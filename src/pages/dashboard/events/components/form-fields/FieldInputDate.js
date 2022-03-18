import * as React from "react";
import styled from "styled-components";

import DatePicker from "react-datepicker";
import { FieldErrorMessage } from "./FieldErrorMessage";

import id from "date-fns/locale/id";
import classnames from "classnames";

function FieldInputDate({
  children,
  label,
  required,
  name,
  placeholder = "DD/MM/YYYY",
  minDate,
  value,
  onChange,
  errors,
  disabled,
  small = false,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;

  return (
    <FieldInputDateWrapper>
      {(children || label) && (
        <label
          className="field-label"
          style={{ fontSize: `${small ? "12px" : "14px"}` }}
          htmlFor={fieldID}
        >
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <DatePicker
        className={classnames({
          "error-invalid": errors?.length,
          "field-input-date": !small,
          "field-input-date-small": small,
        })}
        id={fieldID}
        name={name}
        minDate={minDate}
        selected={value}
        onChange={(date) => onChange?.(date)}
        placeholderText={placeholder}
        locale={id}
        dateFormat="dd/MM/yyyy"
        disabled={disabled}
      />
      <FieldErrorMessage errors={errors} />
    </FieldInputDateWrapper>
  );
}

const FieldInputDateWrapper = styled.div`
  .field-label {
    display: inline-block;
    color: var(--ma-gray-600);
    font-weight: normal;
    margin-bottom: 4px;

    .field-required {
      color: var(--ma-red);
    }
  }

  .field-input-date {
    display: block;
    width: 100%;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: #6a7187;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;

    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &::placeholder {
      color: #6a7187;
      opacity: 0.6;
    }

    &:focus {
      border-color: #2684ff;
      box-shadow: 0 0 0 1px #2684ff;
    }

    &:disabled,
    &[readonly] {
      background-color: #eff2f7;
      opacity: 1;
    }

    &.error-invalid {
      border-color: var(--ma-red);
    }
  }

  .field-input-date-small {
    display: block;
    width: 100%;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
    color: #6a7187;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;

    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &::placeholder {
      color: #6a7187;
      opacity: 0.6;
    }

    &:focus {
      border-color: #2684ff;
      box-shadow: 0 0 0 1px #2684ff;
    }

    &:disabled,
    &[readonly] {
      background-color: #eff2f7;
      opacity: 1;
    }

    &.error-invalid {
      border-color: var(--ma-red);
    }
  }
`;

export default FieldInputDate;
