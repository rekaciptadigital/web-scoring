import * as React from "react";
import { useCategoryDetails } from "../hooks/event-categories";
import { useCategoryFilters } from "../hooks/category-filters";
import { useDisplayController } from "../hooks/display-controller";

const DisplaySettingsContext = React.createContext();

function DisplaySettingsProvider({ children }) {
  const { data: categories, status } = useCategoryDetails();
  const filters = useCategoryFilters(categories);
  const [settingCategories, setSettingCategories] = React.useState([]);
  const [sessionNumber, setSessionNumber] = React.useState(0);
  const controller = useDisplayController(filters, settingCategories);

  React.useEffect(() => {
    if (!filters.categoryOptions?.length || settingCategories.length) {
      return;
    }
    setSettingCategories(filters.categoryOptions);
  }, [filters.categoryOptions]);

  const isSessionSet = sessionNumber > -1;
  const isLoading = !categories && status === "loading";
  const isFetching = categories && status === "loading";
  const maxSessionCount = React.useMemo(() => _getHighestSessionCount(categories), [categories]);

  const context = {
    isLoading,
    isFetching,
    ...filters,
    ...controller,
    settingCategories,
    setSettingCategories,
    maxSessionCount,
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
