import * as React from "react";
import { useStepScreen } from "./step-by-step-screen/hooks/step-screen";
import { useStepContent } from "./step-by-step-screen/hooks/step-content";

import { ButtonBlue } from "components/ma";

function ButtonSave({ children, onSubmit, disabled }) {
  const { id: stepId } = useStepContent();
  const stepScreen = useStepScreen();
  return (
    <ButtonBlue
      corner="8"
      disabled={disabled}
      onClick={() => {
        onSubmit?.({
          stepId,
          ...stepScreen,
          next() {
            stepScreen.gotoNextStep(stepId);
          },
        });
      }}
    >
      {children}
    </ButtonBlue>
  );
}

export { ButtonSave };
