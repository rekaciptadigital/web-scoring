import * as React from "react";
import { StepContentContext } from "../contexts/step-content";

function useStepContent() {
  return React.useContext(StepContentContext);
}

export { useStepContent };
