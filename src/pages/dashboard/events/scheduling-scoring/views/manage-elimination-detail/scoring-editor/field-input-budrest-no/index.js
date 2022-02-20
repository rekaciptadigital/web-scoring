import * as React from "react";

import { FieldInputTextWrapper } from "./styles";

import classnames from "classnames";

function FieldInputBudrestNo({
  children,
  label,
  required,
  name,
  placeholder,
  value = "",
  onChange,
  errors,
  warnings,
  isAutoFocus,
}) {
  const fieldID = name ? `field-input-${name}` : undefined;
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (!isAutoFocus) {
      return;
    }
    inputRef.current?.focus();
  }, []);

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
        ref={inputRef}
        id={fieldID}
        name={name}
        value={value}
        onChange={(ev) => onChange?.(ev.target.value)}
        placeholder={placeholder}
      />
    </FieldInputTextWrapper>
  );
}

export { FieldInputBudrestNo };
