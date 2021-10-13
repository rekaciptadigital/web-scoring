import { useFormWizardContext } from "../../../../components/Form/_utils/context/wizard";

function FormWizardDisplay({ children, tabId }) {
  const { currentStep } = useFormWizardContext();
  if (tabId === currentStep) {
    return children;
  }
  return null;
}

export default FormWizardDisplay;
