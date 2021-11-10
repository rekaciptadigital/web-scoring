function FormWizardDisplay({ children, tabId, activeTab }) {
  if (tabId === activeTab) {
    return children;
  }
  return null;
}

export default FormWizardDisplay;
