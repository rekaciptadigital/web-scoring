import * as React from "react";
import styled from "styled-components";

import Switch from "react-switch";

import classnames from "classnames";
import { stringUtil } from "utils";

function ToggleSwitch({ label, name = _makeDefaultName(), checked, onChange, disabled }) {
  const handleToggling = () => {
    onChange?.();
  };

  return (
    <Label htmlFor={name} className={classnames({ "toggle-disabled": disabled })}>
      <Switch
        id={name}
        name={name}
        disabled={disabled}
        checked={Boolean(checked)}
        onChange={handleToggling}
        offColor="#eeeeee"
        onColor="#B4C6E2"
        onHandleColor="#0d47a1"
        height={16}
        width={40}
        handleDiameter={24}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
      />

      {label && <span>{label}</span>}
    </Label>
  );
}

/* ================================= */
// styles

const Label = styled.label`
  margin: 0;
  font-weight: normal;
  display: flex;
  gap: 0.5rem;
  align-items: center;

  cursor: pointer;

  &.toggle-disabled {
    cursor: default;
  }
`;

/* ================================= */
// utils

const _makeDefaultName = () => "toggle-" + stringUtil.createRandom();

export { ToggleSwitch };
