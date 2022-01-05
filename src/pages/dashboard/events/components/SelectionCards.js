import * as React from "react";
import styled from "styled-components";
import IconCheck from "components/icons/OptionCheck";

const SelectionContext = React.createContext();

export function SelectionCards({ children, value, onChange }) {
  const selectionContextValue = { selectedValue: value, onChange };

  return (
    <SelectionContext.Provider value={selectionContextValue}>
      <div className="selection-cards">{children}</div>
    </SelectionContext.Provider>
  );
}

const OptionCardWrapper = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  transform: translateY(0);
  transition: transform 0.1s;

  ${(p) =>
    p.disabled
      ? ""
      : `&:hover .option-radio:not(.selected) {
      transform: scale(0.85);
      transition: transform 0.2s;
    }
  }`}

  .option-label {
    --cursor-hover: ${(p) => (p.disabled ? "default" : "pointer")};

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;

    cursor: var(--cursor-hover);
  }

  input[type="radio"],
  input[type="radio"]:checked {
    position: absolute;
    top: -200%;
    left: -200%;
    visibility: hidden;
  }

  .option-radio {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 50px;
    height: 50px;
    border-radius: 50px;
    background-color: #efefef;

    transition: transform 0.2s;

    &.selected {
      background-color: #a0bff9;
    }

    &.selected .svg-icon-path {
      stroke: var(--ma-blue);
    }
  }
`;

export function OptionTitle({ children }) {
  return <h3 className="mb-1">{children}</h3>;
}

export function OptionDescription({ children }) {
  return <p className="mb-0">{children}</p>;
}

export function OptionCard({ name, value, children, className = "", disabled }) {
  const { selectedValue, onChange } = React.useContext(SelectionContext);

  const checked = selectedValue === value;
  const optionItemID = `option-${name}-${value}`;

  return (
    <OptionCardWrapper className={className} disabled={disabled}>
      <input
        type="radio"
        id={optionItemID}
        name={name}
        value={value}
        checked={checked}
        onChange={(ev) => onChange?.(ev)}
        disabled={disabled}
      />
      <div className={`flex-shrink-0 option-radio ${checked ? "selected" : ""}`}>
        <IconCheck />
      </div>

      <div className="ms-3">{children}</div>

      <label htmlFor={optionItemID} className="option-label">
        &nbsp;
      </label>
    </OptionCardWrapper>
  );
}
