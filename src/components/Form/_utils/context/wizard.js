import * as React from "react";

const WizardContext = React.createContext();

function FormWizardProvider({ wizard, ...props }) {
  return <WizardContext.Provider value={wizard} {...props} />;
}

function useFormWizardContext() {
  const context = React.useContext(WizardContext);

  if (!context) {
    throw new Error(
      "Provider `FormWizardProvider` belum dipasang. " +
        "Hook `useFormWizardContext` harus children dari `FormWizardProvider`."
    );
  }
  if (!context.validate || !Object.keys(context.validate).length) {
    throw new Error("Monggo set fungsi-fungsi validate-nya terlebih dulu.");
  }
  if (!context.currentStep) {
    throw new Error("Monggo set properti `currentStep`-nya terlebih dulu.");
  }

  return context;
}

export { FormWizardProvider, useFormWizardContext };
