import * as React from "react";

import { stringUtil, datetime } from "utils";

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

const groupLabelsById = {
  1: "Individu",
  2: "Individu (Campuran)",
  3: "Beregu",
  4: "Beregu Campuran",
};

const _makeEmptyConfigItem = (defaultValues = {}) => ({
  key: "regist-date-group-" + stringUtil.createRandom(),
  team: null,
  start: null,
  end: null,
  isSpecialActive: false,
  categories: [_makeEmptyCategoryConfigItem()],
  ...defaultValues,
});

const _makeEmptyCategoryConfigItem = (defaultValues = {}) => ({
  key: "category-config-" + stringUtil.createRandom(),
  categories: [],
  start: null,
  end: null,
  ...defaultValues,
});

/**
 * Headless UI untuk form konfig jadwal khusus.
 * Panggil di komponen Page utama, implemen UI & handler action
 * di komponen anaknya.
 * https://www.merrickchristensen.com/articles/headless-user-interface-components/
 * @param {Array} categories categoriDetail
 * @param {Object} existingConfigs
 */
function useFormRegistrationDates(categories, existingConfigs) {
  const isFirstTimeCreatingConfig = React.useMemo(() => {
    // Sama backend di-define sebagai "0000-00-00 00:00:00"
    // kalau belum diisi tanggalnya
    const invalidDateValues = ["0000-00-00 00:00:00", undefined, false];
    for (const value of [
      existingConfigs?.defaultDatetimeRegister?.start,
      existingConfigs?.defaultDatetimeRegister?.end,
      existingConfigs?.scheduleEvent?.start,
      existingConfigs?.scheduleEvent?.end,
    ]) {
      if (invalidDateValues.indexOf(value) < 0) {
        continue;
      }
      return true;
    }
  }, [existingConfigs]);

  /**
   * Dipakai untuk bikin struktur data option untuk "Jenis Regu"
   * dan option "kategori" untuk konfig jadwal khusus.
   * Note: pencet F12 di definisi const nya untuk lihat dimana
   * aja datanya direferensikan.
   */
  const categoriesByGroupId = React.useMemo(
    () => _groupCategoryByTeamGroup(categories),
    [categories]
  );

  /**
   * Nilai awal untuk form ketika pertama kali dirender. Nilai awal ini akan
   * dihitung ulang ketika list category detail di-get ulang, seperti ketika
   * (1) config di sini berhasil disimpan, atau ketika (2) data category
   * detail diubah/disimpan di step sebelumnya.
   */
  const initialValues = React.useMemo(() => {
    if (!existingConfigs || !categoriesByGroupId) {
      return {
        registrationDateStart: null,
        registrationDateEnd: null,
        eventDateStart: null,
        eventDateEnd: null,
        isActive: false,
        configs: [_makeEmptyConfigItem()],
      };
    }

    const { parseServerDatetime } = datetime;

    const isConfigEnabled = Boolean(existingConfigs.enableConfig);
    const defaultStart = parseServerDatetime(
      existingConfigs.defaultDatetimeRegister?.start
    );
    const defaultEnd = parseServerDatetime(
      existingConfigs.defaultDatetimeRegister?.end
    );
    const eventStart = parseServerDatetime(
      existingConfigs.scheduleEvent?.start
    );
    const eventEnd = parseServerDatetime(existingConfigs.scheduleEvent?.end);
    const defaultEmptyConfigs = [
      {
        ..._makeEmptyConfigItem({ start: defaultStart, end: defaultEnd }),
        categories: [
          _makeEmptyCategoryConfigItem({
            start: defaultStart,
            end: defaultEnd,
          }),
        ],
      },
    ];

    const values = {
      registrationDateStart: defaultStart,
      registrationDateEnd: defaultEnd,
      eventDateStart: eventStart,
      eventDateEnd: eventEnd,
      isActive: isConfigEnabled,
      // config default diset dulu buat "placeholder" biar gak error
      configs: defaultEmptyConfigs,
    };

    if (!isConfigEnabled) {
      return values;
    }

    return {
      ...values,
      configs: existingConfigs.listConfig.map((config) => {
        const hasSomeSpecialConfigs = Boolean(config.listSpecialConfig?.length);
        const isSpecialActive =
          Boolean(config.isHaveSpecial) && hasSomeSpecialConfigs;

        const configValues = {
          ..._makeEmptyConfigItem({
            configId: config.id,
            team: config.configType
              ? {
                  value: config.configType,
                  label: groupLabelsById[config.configType],
                }
              : null,
            start:
              parseServerDatetime(config.datetimeStartRegister) || defaultStart,
            end: parseServerDatetime(config.datetimeEndRegister) || defaultEnd,
            isSpecialActive: isSpecialActive,
          }),
          categories: [
            _makeEmptyCategoryConfigItem({
              start: defaultStart,
              end: defaultEnd,
            }),
          ],
        };

        if (!isSpecialActive) {
          return configValues;
        }

        return {
          ...configValues,
          categories: config.listSpecialConfig?.map((config) => {
            return _makeEmptyCategoryConfigItem({
              configId: config.id,
              categories: _makeInitialValueCategoryPairs(
                config.categories,
                categoriesByGroupId[configValues.team.value]?.categories
              ),
              start: parseServerDatetime(config.datetimeStartRegister),
              end: parseServerDatetime(config.datetimeEndRegister),
            });
          }),
        };
      }),
    };
  }, [existingConfigs, categoriesByGroupId]);

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
              configs: initialValues?.configs || [
                _makeEmptyConfigItem({
                  start: state.data.registrationDateStart,
                  end: state.data.registrationDateEnd,
                }),
              ],
            },
          };
        }

        case actionType.ADD_CONFIG_ITEM: {
          return {
            ...state,
            data: {
              ...state.data,
              configs: [
                ...state.data.configs,
                _makeEmptyConfigItem({
                  start: state.data.registrationDateStart,
                  end: state.data.registrationDateEnd,
                }),
              ],
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
              configs: mutatedConfigs.length
                ? mutatedConfigs
                : [
                    _makeEmptyConfigItem({
                      start: state.data.registrationDateStart,
                      end: state.data.registrationDateEnd,
                    }),
                  ],
            },
          };
        }

        case actionType.CHANGE_TEAM_CATEGORY: {
          const fieldMutation = { team: action.payload };
          return _getStateUpdatedConfigItem(
            state,
            action.configIndex,
            fieldMutation
          );
        }

        case actionType.CHANGE_DATE_RANGE: {
          const fieldMutation = {
            start: action.payload.start,
            end: action.payload.end,
          };
          return _getStateUpdatedConfigItem(
            state,
            action.configIndex,
            fieldMutation
          );
        }

        case actionType.TOGGLE_CONFIG_BY_CATEGORIES: {
          const { registrationDateStart } = state.data;
          const { registrationDateEnd } = state.data;

          const fieldMutation = (state) => ({
            isSpecialActive: !state.isSpecialActive,
            categories: initialValues?.configs?.[action.configIndex]
              ?.categories || [
              _makeEmptyCategoryConfigItem({
                start: registrationDateStart,
                end: registrationDateEnd,
              }),
            ],
          });

          return _getStateUpdatedConfigItem(
            state,
            action.configIndex,
            fieldMutation
          );
        }

        case actionType.ADD_CATEGORY_CONFIG_ITEM: {
          const { registrationDateStart } = state.data;
          const { registrationDateEnd } = state.data;

          const fieldMutation = (state) => ({
            ...state,
            categories: [
              ...state.categories,
              _makeEmptyCategoryConfigItem({
                start: registrationDateStart,
                end: registrationDateEnd,
              }),
            ],
          });

          return _getStateUpdatedConfigItem(
            state,
            action.index.parent,
            fieldMutation
          );
        }

        case actionType.REMOVE_CATEGORY_CONFIG_ITEM: {
          const { registrationDateStart } = state.data;
          const { registrationDateEnd } = state.data;

          const fieldMutation = (state) => {
            const mutatedlist = state.categories.filter(
              (_, index) => index !== action.index.child
            );
            return {
              ...state,
              categories: mutatedlist.length
                ? mutatedlist
                : [
                    _makeEmptyCategoryConfigItem({
                      start: registrationDateStart,
                      end: registrationDateEnd,
                    }),
                  ],
            };
          };

          return _getStateUpdatedConfigItem(
            state,
            action.index.parent,
            fieldMutation
          );
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
          return _getStateUpdatedConfigItem(
            state,
            action.index.parent,
            fieldMutation
          );
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
          return _getStateUpdatedConfigItem(
            state,
            action.index.parent,
            fieldMutation
          );
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
  // `initialValues` nilai memo turunan dari `configs` & `categoriesByGroupId` di atas
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
  const toggleActiveSetting = () =>
    dispatch({ type: actionType.TOGGLE_ACTIVATE });

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
          alreadyUsedPairIds.push(pair?.value);
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
    isFirstTimeCreatingConfig,
    categoriesByGroupId,
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
 * @param {Object|function} mutation `{ [field]: value }` atau fungsi `(state) => ({ ...state, [field]: value })`
 * @returns {*} updated state
 */
function _getStateUpdatedConfigItem(state, configIndex, mutation) {
  const updatedState = {
    ...state,
    data: {
      ...state.data,
      configs: [...state.data.configs],
    },
  };

  const mutatedState =
    typeof mutation === "function"
      ? mutation(updatedState.data.configs[configIndex])
      : mutation;

  updatedState.data.configs[configIndex] = {
    ...updatedState.data.configs[configIndex],
    ...mutatedState,
  };

  return updatedState;
}

/**
 * Melakukan pengelompokkan data list category details menurut
 * "tipe" regu: 1 | 2 | 3 | 4
 * (lihat definisi `const groupLabelsById`)
 */
function _groupCategoryByTeamGroup(categories) {
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
    const groupId = groupIdsByTeam[category.teamCategoryId];

    if (!group[groupId]) {
      const defaultGroupData = {
        value: groupId,
        label: groupLabelsById[groupId],
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
  const alreadySelectedTeamIds =
    configsState?.map((config) => config.team?.value) || [];
  const availableOptions = initialOption.filter(
    (option) => alreadySelectedTeamIds.indexOf(option.value) < 0
  );

  return availableOptions;
}

function _makeInitialValueCategoryPairs(configCategories, optionsPairs) {
  if (!configCategories?.length) {
    return [];
  }

  const uniquePairIds = new Set();
  for (const category of configCategories) {
    const pairId = _getPairId(category);
    if (!pairId) {
      continue;
    }
    !uniquePairIds.has(pairId) && uniquePairIds.add(pairId);
  }

  const valueCategoryPairs = [...uniquePairIds].map((pairId) => {
    return optionsPairs.find((option) => option?.value === pairId);
  });

  return valueCategoryPairs;
}

function _getPairId(category) {
  const segments = category.label?.split(" - ")?.slice(0, 3);
  if (!segments?.length) {
    return;
  }

  // aneh banget nama labelnya dari API dibolak-balik
  const ageCateg = `${segments[1]}`;
  const classCateg = `${segments[0]} - ${segments[2]}`;
  const id = `${ageCateg} - ${classCateg}`;
  return id;
}

export { useFormRegistrationDates };
