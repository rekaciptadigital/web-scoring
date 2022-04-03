import * as React from "react";
import styled from "styled-components";
import { useStepScreen } from "./hooks/step-screen";

import classnames from "classnames";

function StepItem({ children, id }) {
  const { currentStepId, lastUnlocked, getSequenceNumberById, gotoStep } = useStepScreen();

  const isActive = id === currentStepId;
  const sequenceNumber = getSequenceNumberById(id);
  const isLocked = sequenceNumber > lastUnlocked;

  const handleNavigateToStep = () => gotoStep(id);

  const buttonRef = React.useRef(null);
  React.useEffect(() => {
    if (!isActive) {
      return;
    }
    buttonRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "center",
    });
  }, [isActive]);

  return (
    <ButtonStepItem
      ref={buttonRef}
      className={classnames({ "step-active": isActive })}
      disabled={isLocked}
      onClick={handleNavigateToStep}
    >
      <StepNumberBullet className={classnames({ "step-disabled": isLocked })}>
        {sequenceNumber}
      </StepNumberBullet>
      <span>{children}</span>
    </ButtonStepItem>
  );
}

const ButtonStepItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > *:first-child {
    flex-shrink: 0;
  }

  width: 100%;
  padding: 0.625rem 1.25rem;
  border: none;
  background-color: #0d47a1;
  color: #ffffff;

  transition: all 0.3s;

  &:hover {
    color: #ffffff;
    background-color: rgba(212, 226, 252, 0.08);
  }

  &:disabled {
    color: var(--ma-gray-400);
  }

  &:disabled:hover {
    color: var(--ma-gray-400);
    background-color: #0d47a1;
  }

  &.step-active {
    background-color: rgba(212, 226, 252, 0.25);
  }

  @media (min-width: 768px) {
    gap: 0;
    padding: 0.625rem 2.5rem;
    padding-right: 3.125rem;

    &.step-active {
      padding-left: 3.125rem;
      padding-right: 2.5rem;
    }
  }
`;

const StepNumberBullet = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1em;
  width: 2em;
  height: 2em;
  border-radius: 1em;
  background-color: #ffffff;
  color: #0d47a1;

  &.step-disabled {
    background-color: var(--ma-gray-400);
  }
`;

export { StepItem };
