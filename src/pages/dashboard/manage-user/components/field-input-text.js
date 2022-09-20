import * as React from "react";
import styled from "styled-components";
import classnames from "classnames";

function FieldInputText({
  children,
  label,
  type = "text",
  required,
  name,
  placeholder,
  value,
  onChange,
  disabled,
  errors,
  warnings,
  readOnly,
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
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
      />
    </FieldInputTextWrapper>
  );
}

const FieldInputTextWrapper = styled.div`
  .field-label {
    display: inline-block;
    margin: 0.25rem 0;
    color: var(--ma-gray-600);
    font-weight: 600;

    .field-required {
      color: var(--ma-red);
    }
  }

  .field-input-text {
    display: block;
    width: 100%;
    padding: 8px 12px;
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

    &.warning-validation {
      border-color: var(--ma-yellow);
    }
  }
`;

export { FieldInputText };
