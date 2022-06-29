import * as React from "react";

const DisplaySettingsContext = React.createContext();

const sampleCategories = [
  "Compound - U-15 - 40m",
  "Compound - Umum - 50m",
  "Compound - 37+ - 50m",
  "Recurve - Umum - 70m",
  "Recurve - U-15 - 50m",
  "Barebow - Umum - 50m",
  "Nasional - Umum - 30m,40m,50m",
  "Nasional - U-15 - 30m",
  "Nasional - U-12 - 15m",
  "Nasional - U-9 - 10m",
];

function DisplaySettingsProvider({ children }) {
  const [sessionNumber, setSessionNumber] = React.useState(-1);
  const isSessionSet = sessionNumber > -1;

  const context = React.useMemo(
    () => ({
      categories: sampleCategories,
      sessionNumber,
      setSessionNumber,
      isSessionSet,
    }),
    [sampleCategories, sessionNumber, setSessionNumber, isSessionSet]
  );

  return (
    <DisplaySettingsContext.Provider value={context}>{children}</DisplaySettingsContext.Provider>
  );
}

function useDisplaySettings() {
  return React.useContext(DisplaySettingsContext);
}

export { DisplaySettingsProvider, useDisplaySettings };
