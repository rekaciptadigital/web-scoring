import * as React from "react";

function useWizardView(steps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const stepsTotal = steps.length;
  const step = steps[currentStep - 1];

  const goToNextStep = () =>
    setCurrentStep((step) => {
      return step < stepsTotal ? step + 1 : step;
    });

  const goToPreviousStep = () =>
    setCurrentStep((step) => {
      return step > 1 ? step - 1 : step;
    });

  return {
    steps,
    stepsTotal,
    currentStep,
    currentLabel: step.label || "",
    goToNextStep,
    goToPreviousStep,
  };
}

export { useWizardView };
