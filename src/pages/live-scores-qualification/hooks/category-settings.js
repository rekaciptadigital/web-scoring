import * as React from "react";
import { useCategoryDetails } from "./event-categories";

function useCategorySettings() {
  const { data: categories, status } = useCategoryDetails();
  const [filters, dispatch] = React.useReducer(filterReducer, {
    category: null,
    teams: null,
    categoryDetails: null,
    settingCategories: [],
  });

  const { activeCategory, activeTeam, activeCategoryDetail } = _getActiveData(filters);
  const { settingCategories } = filters;

  const categoryOptions = React.useMemo(
    () => _makeCategoryOptions(filters.categoryDetails),
    [filters.categoryDetails]
  );

  const teamOptions = React.useMemo(
    () => _makeTeamOptions(filters.categoryDetails, activeCategory, activeTeam),
    [filters.categoryDetails, activeCategory, activeTeam]
  );

  const maxSessionCount = React.useMemo(() => _getHighestSessionCount(categories), [categories]);

  // Set kategori default sesaat setelah loading
  // Harus jalan cuma sekali di awal ketika belum ada data defaultnya aja
  React.useEffect(() => {
    if (!categories?.length) {
      return;
    }
    dispatch({ type: "INIT", payload: categories });
  }, [categories]);

  React.useEffect(() => {
    if (!activeCategory) {
      return;
    }
    window.scrollTo(0, 0);
  }, [activeCategory]);

  const isLoading = !categories && status === "loading";
  const isFetching = categories && status === "loading";

  const setSettingCategories = (value) => {
    dispatch({ type: "SET_CATEGORY_QUEUE", payload: value });
  };

  const selectCategory = (category) => {
    dispatch({ type: "SELECT_CATEGORY", payload: category });
  };

  const selectTeam = (team) => {
    dispatch({ type: "SELECT_TEAM", payload: team });
  };

  return {
    isLoading,
    isFetching,
    categoryOptions,
    selectCategory,
    activeCategory,
    teamOptions,
    selectTeam,
    activeTeam,
    activeCategoryDetail,
    maxSessionCount,
    settingCategories,
    setSettingCategories,
  };
}

function filterReducer(state, action) {
  if (action.type === "INIT") {
    return _makeInitialState(state, action.payload);
  }

  if (action.type === "SET_CATEGORY_QUEUE") {
    return {
      ...state,
      settingCategories: action.payload,
    };
  }

  if (action.type === "SELECT_CATEGORY") {
    return {
      ...state,
      category: action.payload,
    };
  }

  if (action.type === "SELECT_TEAM") {
    return {
      ...state,
      teams: {
        ...state.teams,
        [state.category]: action.payload,
      },
    };
  }

  return state;
}

function _makeInitialState(state, payload) {
  const groupedCategories = _runGrouping(payload);
  const categories = Object.keys(groupedCategories);
  const defaultCategory = state.category || categories[0];
  const defaultTeam = state.teams || _makeDefaultTeamState(groupedCategories, categories);
  const defaultSettingCategories = categories || [];

  return {
    category: defaultCategory,
    teams: defaultTeam,
    categoryDetails: groupedCategories,
    settingCategories: defaultSettingCategories,
  };
}

function _runGrouping(payload) {
  const sortedByName = payload.sort((first, then) => first.id - then.id);
  return _groupByFilters(sortedByName);
}

function _groupByFilters(data) {
  const categoryDetails = {};
  for (const categoryDetail of data) {
    if (!categoryDetail.isShow) {
      continue;
    }
    const category = _getCategoryName(categoryDetail.labelCategory);
    const team = categoryDetail.teamCategoryId;
    if (!categoryDetails[category]) {
      categoryDetails[category] = {};
    }
    if (!categoryDetails[category][team]) {
      categoryDetails[category][team] = {};
    }
    categoryDetails[category][team] = categoryDetail;
  }
  return categoryDetails;
}

function _getCategoryName(originalLabel) {
  return originalLabel
    .split(" - ")
    .filter((segment, index, segments) => index < segments.length - 1)
    .join(" - ");
}

function _makeDefaultTeamState(groupedCategories, categories) {
  const teamState = {};
  for (const category of categories) {
    teamState[category] = Object.keys(groupedCategories[category])[0];
  }
  return teamState;
}

function _getActiveData(filters) {
  const { category: activeCategory, teams, categoryDetails } = filters;
  const activeTeam = teams?.[activeCategory];
  const activeCategoryDetail = categoryDetails?.[activeCategory]?.[activeTeam] || null;
  return {
    activeCategory,
    activeTeam,
    activeCategoryDetail,
  };
}

function _makeCategoryOptions(data) {
  if (!data) {
    return [];
  }
  const labels = Object.keys(data);
  if (!labels?.length) {
    return [];
  }
  return labels;
}

function _makeTeamOptions(categoryDetails, activeCategory) {
  if (!categoryDetails || !activeCategory) {
    return [];
  }
  const teamFilterLabels = {
    "individu male": "Individu Putra",
    "individu female": "Individu Putri",
    male_team: "Beregu Putra",
    female_team: "Beregu Putri",
    mix_team: "Beregu Campuran",
  };
  const teams = categoryDetails[activeCategory];
  return Object.keys(teams).map((team) => ({
    id: team,
    label: teamFilterLabels[team],
  }));
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

export { useCategorySettings };
