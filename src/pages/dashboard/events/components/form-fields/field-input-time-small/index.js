import * as React from "react";

import DatePicker from "react-datepicker";

import { FieldInputTimeWrapper } from "./styles";

import { getHours, getMinutes, setHours, setMinutes } from "date-fns";
import id from "date-fns/locale/id";
import classnames from "classnames";
import { stringUtil } from "utils";

function FieldInputTimeSmall({
  children,
  label,
  required,
  name,
  placeholder = "00:00",
  value,
  onChange,
  interval,
  disabled,
  errors,
  warnings,
  minTime,
  maxTime,
}) {
  const { defaultTimeId } = useDefaultIDs();
  const fieldID = name ? `field-time-${name}` : defaultTimeId;

  return (
    <FieldInputTimeWrapper>
      {(children || label) && (
        <label className="field-label" htmlFor={fieldID}>
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}

      <DatePicker
        className={classnames("field-input-time", {
          "error-invalid": errors?.length,
          "warning-validation": warnings?.length,
        })}
        id={fieldID}
        name={name}
        selected={value}
        onChange={(date) => {
          // Untuk menyamakan tanggal sesuai dari value yang dikasih prop
          // Kalau enggak dihandle, dia akan fallback ke objek `new Date()`
          const sourceMinutes = getMinutes(date);
          const sourceHours = getHours(date);
          const normalizedMinutes = setMinutes(value, sourceMinutes);
          const normalizedDateTime = setHours(normalizedMinutes, sourceHours);
          onChange?.(normalizedDateTime);
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
        showPopperArrow={false}
        minTime={minTime}
        maxTime={maxTime}
      />
    </FieldInputTimeWrapper>
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

export default FieldInputTimeSmall;
