import * as React from "react";

import teamcategories from "constants/team-categories";
import { stringUtil } from "utils";

// Untuk reducer
const actionType = {
  INIT_FORM: "INIT_FORM",
  TOGGLE_ACTIVATE: "TOGGLE_ACTIVATE",
  ADD_CONFIG_ITEM: "ADD_CONFIG_ITEM",
  REMOVE_CONFIG_ITEM: "REMOVE_CONFIG_ITEM",
  NORMALIZE_EXCESS_CONFIGS: "NORMALIZE_EXCESS_CONFIGS",
  CHANGE_TEAM_CATEGORY: "CHANGE_TEAM_CATEGORY",
  CHANGE_DATE_RANGE: "CHANGE_DATE_RANGE",
  TOGGLE_CONFIG_BY_CATEGORIES: "TOGGLE_CONFIG_BY_CATEGORIES",
  CHANGE_SPECIAL_CATEGORIES: "CHANGE_SPECIAL_CATEGORIES",
};

const _makeDefaultConfigItem = () => ({
  key: "regist-date-group-" + stringUtil.createRandom(),
  team: null,
  registrationDateStart: null,
  registrationDateEnd: null,
  isSpecialActive: false,
  categories: [],
});

/**
 * Headless component untuk form konfig jadwal khusus.
 * Panggil di komponen Page utama, implemen UI & handler action
 * di komponen anaknya.
 * @param {Array} categories
 * @param {Object} configs
 */
function useFormRegistrationDates(categories, configs) {
  const categoriesByTeamId = React.useMemo(() => _groupByTeamCategory(categories), [categories]);

  const initialValues = React.useMemo(() => {
    if (!configs) {
      const emptyConfigItem = _makeDefaultConfigItem();
      return {
        isActive: false,
        configs: [emptyConfigItem],
      };
    }

    // TODO: map data respon API konfig tanggal registrasi ke struktur form
    // ...
    return {
      isActive: true,
      configs: [
        // TODO
      ],
    };
  }, [configs, categoriesByTeamId]);

  const [state, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case actionType.INIT_FORM: {
          return { data: action.payload || initialValues };
        }

        case actionType.TOGGLE_ACTIVATE: {
          return {
            ...state,
            data: {
              ...initialValues,
              isActive: !state.data.isActive,
            },
          };
        }

        case actionType.ADD_CONFIG_ITEM: {
          const newEmptyConfigItem = _makeDefaultConfigItem();
          return {
            ...state,
            data: {
              ...state.data,
              configs: [...state.data.configs, newEmptyConfigItem],
            },
          };
        }

        case actionType.REMOVE_CONFIG_ITEM: {
          return {
            ...state,
            data: {
              ...state.data,
              configs: state.data.configs.filter((item, index) => index !== action.configIndex),
            },
          };
        }

        case actionType.CHANGE_TEAM_CATEGORY: {
          const fieldMutation = { team: action.payload };
          return _getUpdatedStateConfigItem(state, action.configIndex, fieldMutation);
        }

        case actionType.CHANGE_DATE_RANGE: {
          const fieldMutation = {
            registrationDateStart: action.payload.start,
            registrationDateEnd: action.payload.end,
          };
          return _getUpdatedStateConfigItem(state, action.configIndex, fieldMutation);
        }

        case actionType.TOGGLE_CONFIG_BY_CATEGORIES: {
          const fieldMutation = (state) => ({
            isSpecialActive: !state.isSpecialActive,
            categories: [],
          });
          return _getUpdatedStateConfigItem(state, action.configIndex, fieldMutation);
        }

        case actionType.CHANGE_SPECIAL_CATEGORIES: {
          const fieldMutation = { categories: action.payload || [] };
          return _getUpdatedStateConfigItem(state, action.configIndex, fieldMutation);
        }

        default: {
          return state;
        }
      }
    },
    {
      // TODO: `errors: {}` <- untuk state validasi
      data: initialValues,
    }
  );

  // Init ulang form-nya tiap refetch kategori/event detail atau konfig.
  // `initialValues` nilai memo turunan dari `configs` & `categoriesByTeamId` di atas
  React.useEffect(() => {
    if (!initialValues) {
      return;
    }
    dispatch({ type: actionType.INIT_FORM, payload: initialValues });
  }, [initialValues]);

  /**
   * List options untuk jenis regu.
   * Hanya tampil option yang belum dipilih aja.
   */
  const optionsTeamCategory = React.useMemo(
    () => _makeOptionsTeamCategory(categoriesByTeamId, state.data.configs),
    [categoriesByTeamId, state?.data.configs]
  );

  const initForm = () => {
    dispatch({ type: actionType.INIT_FORM, payload: initialValues });
  };

  /**
   * Init/reset state form
   */
  const toggleActiveSetting = () => dispatch({ type: actionType.TOGGLE_ACTIVATE });

  const addConfig = () => dispatch({ type: actionType.ADD_CONFIG_ITEM });

  const removeConfig = (configIndex) => {
    dispatch({
      type: actionType.REMOVE_CONFIG_ITEM,
      configIndex: configIndex,
    });
  };

  // Khusus field di masing-masing konfig //

  /**
   * Simpan opsi regu terpilih sesuai letak indeks state configs
   * @param {int} configIndex Indeks letak objek konfig di dalam state
   * @param {SelectOption} value Objek option dari komponen `Select` { value, label }
   */
  const setTeamCategory = (configIndex, value) => {
    dispatch({
      type: actionType.CHANGE_TEAM_CATEGORY,
      configIndex: configIndex,
      payload: value,
    });
  };

  /**
   * Simpan date range, start & end date sekaligus jadi satu payload
   * @param {int} configIndex
   * @param {Range} value { start, end }
   */
  const setDateRange = (configIndex, value) => {
    dispatch({
      type: actionType.CHANGE_DATE_RANGE,
      configIndex: configIndex,
      payload: value,
    });
  };

  const toggleConfigByCategories = (configIndex) => {
    dispatch({
      type: actionType.TOGGLE_CONFIG_BY_CATEGORIES,
      configIndex: configIndex,
    });
  };

  const getOptionsCategoriesByTeam = React.useCallback(
    (teamCategoryId) => {
      const categories = categoriesByTeamId?.[teamCategoryId]?.categories;
      if (!categories) {
        return [];
      }
      return categories.map((category) => ({
        value: category.categoryDetailsId,
        label: category.label,
      }));
    },
    [categoriesByTeamId]
  );

  const setSpecialCategories = (configIndex, value) => {
    dispatch({
      type: actionType.CHANGE_SPECIAL_CATEGORIES,
      configIndex: configIndex,
      payload: value,
    });
  };

  return {
    categoriesByTeamId,
    data: state.data,
    initForm,
    toggleActiveSetting,
    optionsTeamCategory,
    setTeamCategory,
    setDateRange,
    addConfig,
    removeConfig,
    toggleConfigByCategories,
    getOptionsCategoriesByTeam,
    setSpecialCategories,
  };
}

/* ======================== */
// utils

/**
 * Nge-update state item config menurut index yang mau diupdate.
 * Tujuannya sama kayak immer, tapi gini aja biar simpel.
 * @param {*} state
 * @param {int} configIndex
 * @param {Object} mutation { [field]: value }
 * @returns {*} updated state
 */
function _getUpdatedStateConfigItem(state, configIndex, mutation) {
  const updatedState = {
    ...state,
    data: {
      ...state.data,
      configs: [...state.data.configs],
    },
  };

  const mutatedState =
    typeof mutation === "function" ? mutation(updatedState.data.configs[configIndex]) : mutation;

  updatedState.data.configs[configIndex] = {
    ...updatedState.data.configs[configIndex],
    ...mutatedState,
  };

  return updatedState;
}

function _groupByTeamCategory(categories) {
  if (!categories?.length) {
    return null;
  }

  const group = {};
  const defaultGetDataTeamCategory = (data) => ({
    id: data.teamCategoryId.id,
    label: data.teamCategoryId.label,
  });

  for (const category of categories) {
    const teamCategory = defaultGetDataTeamCategory(category);
    if (!group[teamCategory.id]) {
      const defaultGroup = {
        teamCategoryId: teamCategory.id,
        teamCategoryLabel: teamCategory.label,
        counterStart: {},
        counterEnd: {},
        categories: [],
      };
      group[teamCategory.id] = defaultGroup;
    }

    group[teamCategory.id].categories.push(category);

    if (!category.startRegistration || !category.endRegistration) {
      continue;
    }

    group[teamCategory.id].counterStart[category.startRegistration] =
      (group[teamCategory.id].counterStart[category.startRegistration] || 0) + 1;
    group[teamCategory.id].counterEnd[category.endRegistration] =
      (group[teamCategory.id].counterEnd[category.endRegistration] || 0) + 1;
  }

  const sorted = {};
  for (const id of teamcategories.TEAM_IDS_IN_FIXED_ORDER) {
    if (!group[id]) continue;
    sorted[id] = group[id];
  }

  return sorted;
}

function _makeOptionsTeamCategory(grouped, configsState) {
  if (!grouped) {
    return [];
  }

  const initialOption = Object.values(grouped).map((group) => ({
    value: group.teamCategoryId,
    label: teamcategories.TEAM_LABELS[group.teamCategoryId],
  }));

  const alreadySelectedTeamIds = configsState?.map((config) => config.team?.value) || [];
  const availableOptions = initialOption.filter(
    (option) => alreadySelectedTeamIds.indexOf(option.value) < 0
  );

  return availableOptions;
}

export { useFormRegistrationDates };
