import * as React from "react";
import styled from "styled-components";
import classnames from "classnames";

const FieldSelectRadioWrapper = styled.div`
  display: flex;

  &.error-invalid {
    box-shadow: 0 0 0 1px var(--ma-red);
  }

  .field-radio-label {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;

    &.no-options {
      color: var(--ma-gray-400);
    }

    .field-radio-input {
      margin-right: 0.5rem; /* 8px, dari 1rem = 16px di :root */
    }

    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
`;

function FieldSelectRadio({ name, options, value, onChange, errors, disabled }) {
  const handleSelectRadio = (ev) => {
    const {
      target: { value },
    } = ev;

    onChange({
      label: options.find((item) => item.value === value),
      value: value,
    });
  };

  return (
    <FieldSelectRadioWrapper className={classnames({ "error-invalid": errors?.length })}>
      {options && options.length ? (
        options.map((option) => (
          <label key={option.value} className="field-radio-label">
            <input
              className="field-radio-input"
              type="radio"
              name={name}
              value={option.value}
              checked={value?.value === option.value}
              onChange={handleSelectRadio}
              disabled={disabled}
            />
            {option.label || option.value}
          </label>
        ))
      ) : (
        <div className="field-radio-label no-options">No options</div>
      )}
    </FieldSelectRadioWrapper>
  );
}

export default FieldSelectRadio;
