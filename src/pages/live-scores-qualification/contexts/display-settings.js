import * as React from "react";
import { useCategorySettings } from "../hooks/category-settings";

const DisplaySettingsContext = React.createContext();

function DisplaySettingsProvider({ children }) {
  const { categoryOptions, ...categorySettings } = useCategorySettings();
  const [sessionNumber, setSessionNumber] = React.useState(0);
  const isSessionSet = sessionNumber > -1;

  const context = {
    categories: categoryOptions,
    ...categorySettings,
    sessionNumber,
    setSessionNumber,
    isSessionSet,
  };

  return (
    <DisplaySettingsContext.Provider value={context}>{children}</DisplaySettingsContext.Provider>
  );
}

function useDisplaySettings() {
  return React.useContext(DisplaySettingsContext);
}

export { DisplaySettingsProvider, useDisplaySettings };
