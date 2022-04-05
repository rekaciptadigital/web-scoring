import * as React from "react";
import styled from "styled-components";

function DisplayTextSmall({
  children,
  label,
  displayValue = <React.Fragment>&ndash;</React.Fragment>,
  noBorder = false,
}) {
  return (
    <DisplayTextWrapper>
      {(children || label) && <div className="field-label">{children || label}</div>}
      {noBorder ? (
        <div className="field-no-border-value-text">{displayValue}</div>
      ) : (
        <div className="field-value-text">{displayValue}</div>
      )}
    </DisplayTextWrapper>
  );
}

const DisplayTextWrapper = styled.div`
  .field-label {
    display: inline-block;
    color: var(--ma-gray-600);
    font-size: 12px;
    font-weight: normal;
    margin-bottom: 4px;
  }

  .field-value-text,
  .field-no-border-value-text {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    background-color: transparent;
    background-clip: padding-box;
    border-radius: 0.25rem;
    border: 1px solid transparent;

    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.5;
    color: #6a7187;
  }

  .field-value-text {
    background-color: #eff2f7;
    border: 1px solid #ced4da;

    &.field-no-value {
      color: #6a7187;
      opacity: 0.6;
    }
  }

  .field-no-border-value-text {
    padding: 0.5rem 0;
  }
`;

export { DisplayTextSmall };
