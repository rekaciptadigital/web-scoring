import * as React from "react";
import { StepScreenContext } from "../contexts/step-screen";

function useStepScreen() {
  return React.useContext(StepScreenContext);
}

export { useStepScreen };
