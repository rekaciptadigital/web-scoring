import * as React from "react";

import DatePicker from "react-datepicker";

import { FieldInputDateWrapper } from "./styles";

import id from "date-fns/locale/id";
import classnames from "classnames";
import { stringUtil } from "utils";

function FieldInputDateSmall({
  children,
  label,
  required,
  name,
  placeholder = "DD/MM/YYYY",
  value,
  onChange,
  disabled,
  errors,
  warnings,
  minDate,
  maxDate,
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
}) {
  const { defaultDateId } = useDefaultIDs();
  const fieldID = name ? `field-input-${name}` : defaultDateId;

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
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
        startDate={startDate}
        endDate={endDate}
        showPopperArrow={false}
      />
    </FieldInputDateWrapper>
  );
}

function useDefaultIDs() {
  return React.useMemo(() => {
    const code = stringUtil.createRandom();
    return {
      defaultDateId: `field-date-${code}`,
      defaultTimeId: `field-time-${code}`,
    };
  }, []);
}

export default FieldInputDateSmall;
