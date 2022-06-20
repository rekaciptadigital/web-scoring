import * as React from "react";
import styled from "styled-components";

function SpinnerDotBlock({ message }) {
  return (
    <StyledSpinnerContainer>
      <div className="spinner-grow" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      {Boolean(message) && <div>{message}</div>}
    </StyledSpinnerContainer>
  );
}

const StyledSpinnerContainer = styled.div`
  min-height: 18.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;

  > *:nth-child(2) {
    font-weight: 600;
  }
`;

export { SpinnerDotBlock };
export * from "./loading-screen-portal";
