import * as React from "react";

import { FieldInputTextWrapper } from "./styles";

import classnames from "classnames";

function FieldInputTextSmall({
  children,
  label,
  required,
  name,
  placeholder,
  value = 1,
  onChange,
  disabled,
  errors,
  warnings,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;

  return (
    <FieldInputTextWrapper>
      {(children || label) && (
        <label className="field-label" htmlFor={fieldID}>
          {children || label}
          {required && <span className="field-required">*</span>}
        </label>
      )}
      <input
        className={classnames("field-input-text", {
          "error-invalid": errors?.length,
          "warning-validation": warnings?.length,
        })}
        id={fieldID}
        name={name}
        value={value}
        onChange={(ev) => onChange?.(ev.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </FieldInputTextWrapper>
  );
}

export { FieldInputTextSmall };
