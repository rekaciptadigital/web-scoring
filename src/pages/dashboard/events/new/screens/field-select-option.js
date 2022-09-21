import * as React from "react";
import styled from "styled-components";

import { SelectSetting } from "../components/select-settings";

import { stringUtil } from "utils";

function FieldSelectOption({
  label,
  name = stringUtil.createRandom(),
  required,
  placeholder,
  noOptionsMessage = "Pilihan tidak tersedia",
  options = [],
  value = [],
  onChange,
  disabled,
  errors,
}) {
  const fieldID = `field-${name}`;
  const title = label || undefined;
  return (
    <FieldInputTextWrapper>
      <label className="field-label" htmlFor={fieldID} title={title}>
        {label}
        {required && <span className="field-required">*</span>}
      </label>
      <SelectSetting
        placeholder={placeholder}
        id={fieldID}
        noOptionsMessage={noOptionsMessage}
        value={value}
        options={options}
        onChange={onChange}
        disabled={disabled}
        errors={errors}
      />
      <InlineErrorMessage errors={errors} />
    </FieldInputTextWrapper>
  );
}

function InlineErrorMessage({ errors }) {
  if (!errors?.length) {
    return null;
  }
  return <MessageError>{errors[0]}</MessageError>;
}

/* ============================== */
// styles

const FieldInputTextWrapper = styled.section`
  .field-label {
    display: block;
    color: var(--ma-gray-600);
    font-size: 12px;
    font-weight: normal;
    margin-bottom: 4px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .field-required {
      color: var(--ma-red);
    }
  }

  .field-input-text {
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

    &:disabled {
      background-color: #eff2f7;
      opacity: 1;
    }

    &.error-invalid {
      border-color: var(--ma-border-negative);
      box-shadow: 0 0 0 1px var(--ma-border-negative);
      background-color: var(--ma-bg-negative);

      &:focus {
        border-color: #2684ff;
        box-shadow: 0 0 0 1px #2684ff;
      }
    }
  }
`;

const MessageError = styled.span`
  color: var(--ma-text-negative);
  font-size: 0.625rem;
`;

export { FieldSelectOption };
