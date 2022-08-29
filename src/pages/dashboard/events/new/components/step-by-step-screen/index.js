import * as React from "react";
import styled from "styled-components";

import { StepScreenContext } from "./contexts/step-screen";

function StepByStepScreen({ children, lastUnlocked }) {
  const steps = useStepScreenNavigation();
  const { currentStepId } = steps;

  /**
   * Scroll to top on switch step
   */
  React.useEffect(() => {
    if (!currentStepId) {
      return;
    }
    window.scrollTo(0, 0);
  }, [currentStepId]);

  return (
    <StepScreenContext.Provider value={{ ...steps, lastUnlocked }}>
      <StickyContainer>{children}</StickyContainer>
    </StepScreenContext.Provider>
  );
}

const StickyContainer = styled.div`
  > * + * {
    margin-top: 2rem;
  }

  @media (min-width: 768px) {
    > * + * {
      margin-top: 0;
    }

    display: flex;
    align-items: flex-start;
    gap: 1.5rem;

    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;

    > div:first-child {
      flex-grow: 0;
      flex-shrink: 0;
      min-width: fit-content;
    }

    > div:nth-child(2) {
      flex-grow: 1;
      flex-shrink: 1;
      min-width: 0;
    }
  }
`;

/* ============================================ */

function useStepScreenNavigation() {
  const [stepsData, setStepsData] = React.useState(null);
  const [currentStepId, setCurrentStepId] = React.useState();

  /**
   * Set default current step id ketika
   * belum diset / tidak dikasih param defaultnya
   */
  React.useEffect(() => {
    if (currentStepId || !stepsData) {
      return;
    }
    const targetStepId = stepsData[0]?.stepId;
    targetStepId && gotoStep(targetStepId);
  }, [currentStepId, stepsData]);

  /**
   * Function aksi/setter
   */
  const registerStepContent = (stepsData) => setStepsData(stepsData);
  const gotoStep = (stepId) => setCurrentStepId(stepId);

  const gotoPreviousStep = (stepId) => {
    const currentSequence = getSequenceNumberById(stepId);
    const currentIndex = currentSequence - 1;
    const previousIndex = currentIndex - 1;
    const previousStep = stepsData[previousIndex];
    setCurrentStepId(previousStep.stepId);
  };

  const gotoNextStep = (stepId) => {
    const currentSequence = getSequenceNumberById(stepId);
    const nextIndex = currentSequence;
    const nextStep = stepsData[nextIndex];
    setCurrentStepId(nextStep.stepId);
  };

  const getSequenceNumberById = (targetId) => {
    if (!targetId || !stepsData) {
      return 1;
    }
    const targetStep = stepsData.find((step) => targetId === step.stepId);
    return targetStep?.sequence || 1;
  };

  return {
    stepsData,
    currentStepId,
    registerStepContent,
    gotoStep,
    gotoPreviousStep,
    gotoNextStep,
    getSequenceNumberById,
  };
}

/* ============================================ */

export { StepByStepScreen };
export * from "./contexts/step-screen";
export * from "./hooks/step-screen";
export * from "./step-list-indicator";
export * from "./step-item";
export * from "./step-display";
