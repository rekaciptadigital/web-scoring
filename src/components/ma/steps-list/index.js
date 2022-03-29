import * as React from "react";
import styled from "styled-components";
import classnames from "classnames";

const StepListWrapper = styled.div`
  padding: 20px 0;
  background-color: #0d47a1;
  border-radius: 8px;

  ul.steps-list,
  ol.steps-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .steps-undefined {
    padding: 10px 30px 10px 40px;
    color: #ffffff;
  }
`;

const StepListHeading = styled.div`
  padding: 10px 30px 10px 40px;
  text-transform: uppercase;
  font-weight: 600;
  color: #ffffff;
`;

const StepListItemWrapper = styled.li`
  .step-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 30px 10px 40px;
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
  }

  &.active-step .step-item {
    background-color: rgba(212, 226, 252, 0.25);
    padding-left: 50px;
  }
`;

function StepListItem({ children, className, onClick, disabled }) {
  return (
    <StepListItemWrapper className={className}>
      <button className="step-item" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </StepListItemWrapper>
  );
}

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

function StepList({ children, steps, currentStep, lastActiveStep, onChange }) {
  return (
    <StepListWrapper>
      {children && <StepListHeading>{children}</StepListHeading>}

      {steps && steps.length && (
        <ol className="steps-list">
          {steps?.map((stepItem) => {
            const shouldDisableStep = lastActiveStep && stepItem.step > lastActiveStep;

            return (
              <StepListItem
                key={stepItem.step}
                className={classnames({ "active-step": currentStep === stepItem.step })}
                onClick={() => {
                  if (onChange) {
                    const ev = { target: { value: stepItem.step } };
                    onChange(ev);
                  }
                }}
                disabled={shouldDisableStep}
              >
                <StepNumberBullet className={classnames({ "step-disabled": shouldDisableStep })}>
                  {stepItem.step}
                </StepNumberBullet>{" "}
                {stepItem.label}
              </StepListItem>
            );
          })}
        </ol>
      )}
    </StepListWrapper>
  );
}

export { StepList };
