import * as React from "react";
import { useCategoryDetails } from "../hooks/event-categories";
import { useCategoryFilters } from "../hooks/category-filters";
import { useDisplayController } from "../hooks/display-controller";

const DisplaySettingsContext = React.createContext();

function DisplaySettingsProvider({ children }) {
  const { data: categories, status } = useCategoryDetails();
  const filters = useCategoryFilters(categories);
  const [stage, setStage] = React.useState("qualification");
  const [settingCategories, setSettingCategories] = React.useState([]);
  const [sessionNumber, setSessionNumber] = React.useState(0);
  const controller = useDisplayController(filters, settingCategories);
  const [lastUpdated, setLastUpdated] = React.useState(() => new Date());
  const [roundOptions, setRoundOptions] = React.useState(0);
  const [round, setRound] = React.useState(0);

  React.useEffect(() => {
    if (!filters.categoryOptions?.length || settingCategories.length) {
      return;
    }
    setSettingCategories(filters.categoryOptions);
  }, [filters.categoryOptions]);

  // Reset last updated ketika status dari gak running berubah jadi running.
  // Supaya waktu/date yang tampil pas date-nya running.
  React.useEffect(() => {
    if (!controller.isRunning) {
      return;
    }
    setLastUpdated(() => new Date());
  }, [controller.isRunning]);

  const isSessionSet = sessionNumber > -1;
  const isLoading = !categories && status === "loading";
  const isFetching = categories && status === "loading";
  const isQualification = stage === "qualification";
  const isElimination = stage === "elimination";
  const maxSessionCount = React.useMemo(() => _getHighestSessionCount(categories), [categories]);

  const nextWithResetRound = () => {
    setRound(0);
    controller.next();
  };

  const context = {
    isLoading,
    isFetching,
    isQualification,
    isElimination,
    ...filters,
    ...controller,
    next: nextWithResetRound,
    stage,
    setStage,
    settingCategories,
    setSettingCategories,
    maxSessionCount,
    sessionNumber,
    setSessionNumber,
    isSessionSet,
    lastUpdated,
    setLastUpdated,
    roundOptions,
    setRoundOptions,
    round,
    setRound,
  };

  return (
    <DisplaySettingsContext.Provider value={context}>{children}</DisplaySettingsContext.Provider>
  );
}

function useDisplaySettings() {
  return React.useContext(DisplaySettingsContext);
}

function _getHighestSessionCount(categories) {
  if (!categories?.length) {
    return 0;
  }
  let lastHighestCount = 0;
  for (const category of categories) {
    if (
      !category.isShow ||
      !category.sessionInQualification ||
      category.sessionInQualification <= lastHighestCount
    ) {
      continue;
    }
    lastHighestCount = category.sessionInQualification;
  }
  return lastHighestCount;
}

export { DisplaySettingsProvider, useDisplaySettings };
