import * as React from "react";
import styled from "styled-components";
import { useStepScreen } from "./hooks/step-screen";

import { StepContentContext } from "./contexts/step-content";
import { useStepContent } from "./hooks/step-content";

import { ButtonOutlineBlue } from "components/ma";

function StepDisplay({ children }) {
  const { currentStepId, registerStepContent } = useStepScreen();
  const childrenList = React.Children.toArray(children);
  const currentChildById = childrenList.find((child) => child.props.id === currentStepId);

  React.useEffect(() => {
    if (!children) {
      return;
    }

    const stepsData = childrenList
      .filter((child) => child.type.name === "StepContent")
      .map((child, index) => ({ sequence: index + 1, stepId: child.props.id }));

    registerStepContent(stepsData);
  }, []);

  return currentChildById || childrenList[0] || null;
}

/* ======================================== */

function StepContent({ children, id }) {
  if (!children) {
    return null;
  }
  return (
    <StepContentContext.Provider value={{ id }}>
      <div>{children}</div>
    </StepContentContext.Provider>
  );
}

/* ======================================== */

function StepHeader({ children }) {
  return <StickyHeader>{children}</StickyHeader>;
}

const StickyHeader = styled.div`
  position: sticky;
  top: 2.5rem;
  z-index: 80;
  background-color: var(--bs-body-bg);
  padding-top: var(--ma-header-height);
  padding-bottom: 0.25rem;
  margin-top: calc(-1 * var(--ma-header-height));
`;

/* ======================================== */

function StepBody({ children }) {
  return <StyledBody>{children}</StyledBody>;
}

const StyledBody = styled.div`
  min-height: 200px;
`;

/* ======================================== */

function StepFooterActions({ children, backButtonLabel = "Sebelumnya" }) {
  const { id } = useStepContent();
  const { getSequenceNumberById, gotoPreviousStep } = useStepScreen();

  const isFirstStep = getSequenceNumberById(id) === 1;

  return (
    <StyledFooterActions>
      <div>
        {!isFirstStep && (
          <ButtonOutlineBlue corner="8" disabled={isFirstStep} onClick={() => gotoPreviousStep(id)}>
            {backButtonLabel}
          </ButtonOutlineBlue>
        )}
      </div>

      <div>{children}</div>
    </StyledFooterActions>
  );
}

const StyledFooterActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

export { StepDisplay, StepContent, StepHeader, StepBody, StepFooterActions };
