import * as React from "react";

import { stringUtil } from "utils";

// Untuk reducer
const actionType = {
  INIT_FORM: "INIT_FORM",
  CHANGE_FIELD: "CHANGE_FIELD",

  TOGGLE_ACTIVATE: "TOGGLE_ACTIVATE",
  ADD_CONFIG_ITEM: "ADD_CONFIG_ITEM",
  REMOVE_CONFIG_ITEM: "REMOVE_CONFIG_ITEM",
  NORMALIZE_EXCESS_CONFIGS: "NORMALIZE_EXCESS_CONFIGS", // TODO:
  CHANGE_TEAM_CATEGORY: "CHANGE_TEAM_CATEGORY",
  CHANGE_DATE_RANGE: "CHANGE_DATE_RANGE",

  TOGGLE_CONFIG_BY_CATEGORIES: "TOGGLE_CONFIG_BY_CATEGORIES",
  ADD_CATEGORY_CONFIG_ITEM: "ADD_CATEGORY_CONFIG_ITEM",
  REMOVE_CATEGORY_CONFIG_ITEM: "REMOVE_CATEGORY_CONFIG_ITEM",
  CHANGE_SPECIAL_CATEGORIES: "CHANGE_SPECIAL_CATEGORIES",
  CHANGE_DATE_RANGE_CATEGORY: "CHANGE_DATE_RANGE_CATEGORY",
};

const _makeEmptyConfigItem = () => ({
  key: "regist-date-group-" + stringUtil.createRandom(),
  team: null,
  start: null,
  end: null,
  isSpecialActive: false,
  categories: [_makeEmptyCategoryConfigItem()],
});

const _makeEmptyCategoryConfigItem = () => ({
  key: "category-config-" + stringUtil.createRandom(),
  categories: [],
  start: null,
  end: null,
});

/**
 * Headless UI untuk form konfig jadwal khusus.
 * Panggil di komponen Page utama, implemen UI & handler action
 * di komponen anaknya.
 * https://www.merrickchristensen.com/articles/headless-user-interface-components/
 * @param {Array} categories
 * @param {Object} configs
 */
function useFormRegistrationDates(categories, configs) {
  const categoriesByGroupId = React.useMemo(() => _groupByTeamCategory(categories), [categories]);

  const initialValues = React.useMemo(() => {
    if (!configs) {
      const emptyConfigItem = _makeEmptyConfigItem();
      return {
        registrationDateStart: null,
        registrationDateEnd: null,
        eventDateStart: null,
        eventDateEnd: null,
        isActive: false,
        configs: [emptyConfigItem],
      };
    }

    // TODO: map data respon API konfig tanggal registrasi ke struktur form
    // ...
    return {
      registrationDateStart: null,
      registrationDateEnd: null,
      eventDateStart: null,
      eventDateEnd: null,
      isActive: true,
      configs: [
        // TODO
      ],
    };
  }, [configs, categoriesByGroupId]);

  const [state, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case actionType.INIT_FORM: {
          return { data: action.payload || initialValues };
        }

        case actionType.CHANGE_FIELD: {
          return {
            ...state,
            data: { ...state.data, ...action.payload },
          };
        }

        case actionType.TOGGLE_ACTIVATE: {
          return {
            ...state,
            data: {
              ...state.data,
              isActive: !state.data.isActive,
              configs: initialValues?.configs,
            },
          };
        }

        case actionType.ADD_CONFIG_ITEM: {
          const newEmptyConfigItem = _makeEmptyConfigItem();
          return {
            ...state,
            data: {
              ...state.data,
              configs: [...state.data.configs, newEmptyConfigItem],
            },
          };
        }

        case actionType.REMOVE_CONFIG_ITEM: {
          const mutatedConfigs = state.data.configs.filter(
            (item, index) => index !== action.configIndex
          );
          return {
            ...state,
            data: {
              ...state.data,
              configs: mutatedConfigs.length ? mutatedConfigs : [_makeEmptyConfigItem],
            },
          };
        }

        case actionType.CHANGE_TEAM_CATEGORY: {
          const fieldMutation = { team: action.payload };
          return _getUpdatedStateConfigItem(state, action.configIndex, fieldMutation);
        }

        case actionType.CHANGE_DATE_RANGE: {
          const fieldMutation = {
            start: action.payload.start,
            end: action.payload.end,
          };
          return _getUpdatedStateConfigItem(state, action.configIndex, fieldMutation);
        }

        case actionType.TOGGLE_CONFIG_BY_CATEGORIES: {
          const fieldMutation = (state) => ({
            isSpecialActive: !state.isSpecialActive,
            categories: [_makeEmptyCategoryConfigItem()],
          });
          return _getUpdatedStateConfigItem(state, action.configIndex, fieldMutation);
        }

        case actionType.ADD_CATEGORY_CONFIG_ITEM: {
          const fieldMutation = (state) => ({
            ...state,
            categories: [...state.categories, _makeEmptyCategoryConfigItem()],
          });
          return _getUpdatedStateConfigItem(state, action.index.parent, fieldMutation);
        }

        case actionType.REMOVE_CATEGORY_CONFIG_ITEM: {
          const fieldMutation = (state) => {
            const mutatedlist = state.categories.filter((_, index) => index !== action.index.child);
            return {
              ...state,
              categories: mutatedlist.length ? mutatedlist : [_makeEmptyCategoryConfigItem()],
            };
          };
          return _getUpdatedStateConfigItem(state, action.index.parent, fieldMutation);
        }

        case actionType.CHANGE_SPECIAL_CATEGORIES: {
          const fieldMutation = (state) => ({
            ...state,
            categories: state.categories.map((item, index) => {
              return index !== action.index.child
                ? item
                : {
                    ...item,
                    categories: action.payload || [],
                  };
            }),
          });
          return _getUpdatedStateConfigItem(state, action.index.parent, fieldMutation);
        }

        case actionType.CHANGE_DATE_RANGE_CATEGORY: {
          const fieldMutation = (state) => ({
            ...state,
            categories: state.categories.map((item, index) => {
              return index !== action.index.child
                ? item
                : {
                    ...item,
                    ...action.payload,
                  };
            }),
          });
          return _getUpdatedStateConfigItem(state, action.index.parent, fieldMutation);
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
    () => _makeOptionsCategoryGroup(categoriesByGroupId, state.data.configs),
    [categoriesByGroupId, state.data.configs]
  );

  const initForm = () => {
    dispatch({ type: actionType.INIT_FORM, payload: initialValues });
  };

  const updateField = (field, value) => {
    dispatch({
      type: actionType.CHANGE_FIELD,
      payload: { [field]: value },
    });
  };

  const updateFields = (action) => {
    dispatch({
      type: actionType.CHANGE_FIELD,
      payload: action,
    });
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

  const addCategoryConfig = (parentIndex, childIndex) => {
    dispatch({
      type: actionType.ADD_CATEGORY_CONFIG_ITEM,
      index: { parent: parentIndex, child: childIndex },
    });
  };

  const removeCategoryConfig = (parentIndex, childIndex) => {
    dispatch({
      type: actionType.REMOVE_CATEGORY_CONFIG_ITEM,
      index: { parent: parentIndex, child: childIndex },
    });
  };

  const getOptionsCategoryPairByGroupId = React.useCallback(
    (groupId, configIndex) => {
      if (
        !groupId ||
        typeof configIndex === "undefined" ||
        !categoriesByGroupId?.[groupId]?.categories
      ) {
        return [];
      }

      const alreadyUsedPairIds = [];
      for (const item of state.data.configs[configIndex].categories) {
        for (const pair of item.categories) {
          alreadyUsedPairIds.push(pair.value);
        }
      }
      const initialOptions = categoriesByGroupId[groupId].categories;
      const availableOptions = initialOptions.filter(
        (option) => alreadyUsedPairIds.indexOf(option.value) < 0
      );

      return availableOptions;
    },
    [categoriesByGroupId, state.data.configs]
  );

  const setSpecialCategories = (configIndex, childIndex, value) => {
    dispatch({
      type: actionType.CHANGE_SPECIAL_CATEGORIES,
      index: { parent: configIndex, child: childIndex },
      payload: value,
    });
  };

  /**
   * Date range untuk kategori khusus
   * @param {int} configIndex
   * @param {int} childIndex
   * @param {Range} range { start, end }
   */
  const setDateRangeCategory = (configIndex, childIndex, range) => {
    dispatch({
      type: actionType.CHANGE_DATE_RANGE_CATEGORY,
      index: { parent: configIndex, child: childIndex },
      payload: range,
    });
  };

  return {
    categoriesByTeamId: categoriesByGroupId,
    data: state.data,
    initForm,
    updateField,
    updateFields,
    toggleActiveSetting,
    optionsTeamCategory,
    setTeamCategory,
    setDateRange,
    addConfig,
    removeConfig,
    toggleConfigByCategories,
    addCategoryConfig,
    removeCategoryConfig,
    getOptionsCategoryPairByGroupId,
    setSpecialCategories,
    setDateRangeCategory,
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

  /**
   * Bikin struktur data kayak gini:
   * {
   *   [groupId]: {
   *     value: groupId,
   *     label: "group label"
   *     categories: [
   *       {
   *         value: "pair label"
   *         label: "pair label"
   *         categories: [
   *           { ...categoryDetail },
   *         ]
   *       }
   *     ]
   *   },
   *   ...
   * }
   */
  const group = {};
  for (const category of categories) {
    const groupIdsByTeam = {
      "individu male": 1,
      "individu female": 1,
      individu_mix: 2,
      male_team: 3,
      female_team: 3,
      mix_team: 4,
    };
    const groupLabels = {
      1: "Individu",
      2: "Individu (Campuran)",
      3: "Beregu",
      4: "Beregu Campuran",
    };
    const groupId = groupIdsByTeam[category.teamCategoryId];

    if (!group[groupId]) {
      const defaultGroupData = {
        value: groupId,
        label: groupLabels[groupId],
        categories: {},
      };
      group[groupId] = defaultGroupData;
    }

    const pairId = `${category.competitionCategoryId} - ${category.classCategory}`;

    if (!group[groupId].categories[pairId]) {
      group[groupId].categories[pairId] = {
        value: pairId,
        label: pairId,
        categories: [],
      };
    }

    group[groupId].categories[pairId].categories.push(category);
  }

  // handle struktur pasangan kategori (tanpa gender)
  for (const groupId in group) {
    group[groupId].categories = Object.values(group[groupId].categories);
  }

  return group;
}

function _makeOptionsCategoryGroup(grouped, configsState) {
  if (!grouped) {
    return [];
  }

  const initialOption = Object.values(grouped).map((group) => ({
    value: group.value,
    label: group.label,
  }));
  const alreadySelectedTeamIds = configsState?.map((config) => config.team?.value) || [];
  const availableOptions = initialOption.filter(
    (option) => alreadySelectedTeamIds.indexOf(option.value) < 0
  );

  return availableOptions;
}

export { useFormRegistrationDates };
