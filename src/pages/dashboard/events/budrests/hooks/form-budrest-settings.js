import * as React from "react";
import { stringUtil, misc } from "utils";

function useFormBudrestSettings(initialSettingsData) {
  const [state, dispatch] = React.useReducer(formReducer, {
    data: makeInitialState(initialSettingsData),
    status: "",
    errors: {},
  });

  const updateField = (key, fieldName, value) => {
    dispatch({ type: "FIELD_UPDATE", key: key, field: fieldName, payload: value });
  };

  const updateFieldStart = (key, value) => {
    dispatch({ type: "UPDATE_FIELD_START", key: key, payload: value });
  };

  const updateFieldEnd = (key, value) => {
    dispatch({ type: "UPDATE_FIELD_END", key: key, payload: value });
  };

  return { ...state, updateField, updateFieldStart, updateFieldEnd };
}

function formReducer(state, action) {
  switch (action.type) {
    case "FIELD_UPDATE": {
      return {
        ...state,
        data: state.data.map((setting) => {
          if (setting.key !== action.key) {
            return setting;
          }
          const value = misc.convertAsNumber(action.payload, setting[action.field]);
          return { ...setting, [action.field]: value || "" };
        }),
      };
    }

    case "UPDATE_FIELD_START": {
      return {
        ...state,
        data: state.data.map((setting) => {
          if (setting.key !== action.key) {
            return setting;
          }
          const value = misc.convertAsNumber(action.payload, setting.start);
          const endNumber = computeEndNumber(value, setting.totalParticipant, setting.targetFace);
          return {
            ...setting,
            start: value || "",
            // Rekomendasikan angka akhir bantalan sesuai angka awal yang diinput
            end: endNumber || "",
          };
        }),
      };
    }

    case "UPDATE_FIELD_END": {
      return {
        ...state,
        data: state.data.map((setting) => {
          if (setting.key !== action.key) {
            return setting;
          }
          const value = misc.convertAsNumber(action.payload, setting.end);
          return { ...setting, end: value || "" };
        }),
      };
    }

    default: {
      return state;
    }
  }
}

function makeInitialState(initialData) {
  if (!initialData?.settings?.length) {
    // Buat jaga-jaga kalau-kalau data yang udah ditransform di fetcher gak ada.
    // Biar gak crash ...meskipun kecil kemungkinannya
    return [
      {
        key: stringUtil.createRandom(),
        date: "",
        type: "qualification",
        categoryDetailId: undefined,
        categoryDetailLabel: "Data tidak ditemukan",
        totalParticipant: 0,
        start: 0,
        end: 0,
        targetFace: 4,
      },
    ];
  }

  return initialData.settings.map((setting) => ({
    key: stringUtil.createRandom(),
    ...setting,
    // kasih nilai default 4
    targetFace: setting.targetFace || 4,
  }));
}

function computeEndNumber(input, totalParticipant, numbersOfTargetFace) {
  if (!input) {
    return input;
  }
  const numbersOfRequiredBudrests = Math.ceil(totalParticipant / numbersOfTargetFace);
  const range = numbersOfRequiredBudrests - 1;
  const resultEndNumber = input + range;
  return resultEndNumber;
}

export { useFormBudrestSettings };
