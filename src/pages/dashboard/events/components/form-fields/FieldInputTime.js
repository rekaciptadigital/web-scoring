import * as React from "react";
import styled from "styled-components";

import DatePicker from "react-datepicker";

import id from "date-fns/locale/id";
import { setHours, setMinutes } from "date-fns";
import classnames from "classnames";

function FieldInputTime({
  children,
  label,
  required,
  name,
  placeholder = "00:00",
  minTime,
  maxTime,
  value,
  onChange,
  interval,
  errors,
  disabled,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;

  return (
    <FieldInputTimeWrapper>
      {(children || label) && (
        <label className="field-label" htmlFor={fieldID}>
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <DatePicker
        className={classnames("field-input-time", { "error-invalid": errors?.length })}
        id={fieldID}
        name={name}
        minTime={minTime}
        maxTime={maxTime}
        selected={value}
        onChange={(datetime) => {
          if (!onChange || !value) {
            return;
          }
          // Kalau diinput manual, date-nya fallback jadi "today".
          // Paksa date-nya jadi sesuai keadaan prop value sebelum di-update nilainya
          const valueDateTime = datetime
            ? setHours(setMinutes(value, datetime.getMinutes()), datetime.getHours())
            : value;
          onChange(valueDateTime);
        }}
        placeholderText={placeholder}
        locale={id}
        timeFormat="H:mm"
        dateFormat="H:mm"
        timeIntervals={interval || 15}
        timeCaption="Pukul"
        showTimeSelect
        showTimeSelectOnly
        disabled={disabled}
      />
    </FieldInputTimeWrapper>
  );
}

const FieldInputTimeWrapper = styled.div`
  .field-label {
    display: inline-block;
    color: var(--ma-gray-600);
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 4px;

    .field-required {
      color: var(--ma-red);
    }
  }

  .field-input-time {
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
`;

export default FieldInputTime;
