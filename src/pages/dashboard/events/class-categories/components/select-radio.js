import * as React from "react";
import styled from "styled-components";

import IconDot from "components/ma/icons/mono/dot";

import { stringUtil } from "utils";

function SelectRadio({ options = null, name = _makeDefaultName(), defaultValue, value, onChange }) {
  return (
    <ToggleWrapper>
      {!options?.length ? (
        <span>Opsi tidak tersedia</span>
      ) : (
        options.map((option, index) => {
          const id = name + "-" + (option.value || index);
          return (
            <span key={option.value}>
              <InputToggleItem
                type="radio"
                name={name}
                id={id}
                value={option.value}
                checked={option.value === (value || defaultValue || "")}
                onChange={(ev) => onChange?.(ev.target.value)}
              />
              <ToggleButton htmlFor={id}>
                <span>
                  <IconDot size="0.625em" />
                </span>
                <span>{option.label}</span>
              </ToggleButton>
            </span>
          );
        })
      )}
    </ToggleWrapper>
  );
}

/* ================================= */
// styles

const ToggleWrapper = styled.div`
  display: inline-block;

  > * + * {
    margin-left: 0.5rem;
  }
`;

const InputToggleItem = styled.input`
  position: absolute;
  top: -1000px;
  left: -1000px;
  visibility: hidden;
  margin: 0;
`;

const ToggleButton = styled.label`
  cursor: pointer;
  margin: 0;
  padding: 0.5rem 0.875rem;
  border-radius: 0.15rem;
  background-color: var(--ma-gray-200);
  font-weight: 400;

  > * + * {
    margin-left: 0.5rem;
  }

  > *:nth-child(1) {
    color: var(--ma-gray-400);
    transition: color 0.25s;
  }

  &:hover > *:nth-child(1) {
    color: var(--ma-field-focused);
  }

  input:checked + & {
    background-color: var(--ma-primary-blue-50);
    color: var(--ma-blue);

    > *:nth-child(1) {
      color: var(--ma-field-focused);
    }
  }

  /* TODO: focus state */
`;

/* ================================= */
// utils

const _makeDefaultName = () => "option-" + stringUtil.createRandom();

export { SelectRadio };
