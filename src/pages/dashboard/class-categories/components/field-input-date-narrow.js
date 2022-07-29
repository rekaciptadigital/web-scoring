import * as React from "react";
import styled from "styled-components";

import DatePicker from "react-datepicker";

import id from "date-fns/locale/id";
import classnames from "classnames";

function FieldInputDateNarrow({
  children,
  label,
  required,
  name,
  placeholder = "HH/BB/TTTT",
  value,
  onChange,
  disabled,
  errors,
  warnings,
  minDate,
  maxDate,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;

  return (
    <FieldInputDateWrapper>
      {(children || label) && (
        <label className="field-label" htmlFor={fieldID}>
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <DatePicker
        className={classnames("field-input-date", {
          "error-invalid": errors?.length,
          "warning-validation": warnings?.length,
        })}
        id={fieldID}
        name={name}
        selected={value}
        onChange={(date) => onChange?.(date)}
        placeholderText={placeholder}
        locale={id}
        dateFormat="dd/MM/yyyy"
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        showPopperArrow={false}
      />
    </FieldInputDateWrapper>
  );
}

const FieldInputDateWrapper = styled.div`
  .field-label {
    display: block;
    color: var(--ma-gray-600);
    margin-bottom: 0.25rem;

    .field-required {
      color: var(--ma-red);
    }
  }

  .react-datepicker-wrapper {
    width: max-content !important;
  }

  .field-input-date {
    width: 7.5rem;
    padding: 0.5rem 0.75rem;
    font-weight: 400;
    line-height: 1.5;
    color: #6a7187;
    background-color: #ffffff;
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

    &:disabled {
      background-color: #eff2f7;
      opacity: 1;
    }

    &.error-invalid {
      border-color: var(--ma-red);
      box-shadow: 0 0 0 1px var(--ma-border-negative);
      background-color: var(--ma-bg-negative);

      &:focus {
        border-color: #2684ff;
        box-shadow: 0 0 0 1px #2684ff;
      }
    }

    &.warning-validation {
      border-color: var(--ma-yellow);
    }
  }
`;

export { FieldInputDateNarrow };
