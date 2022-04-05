import * as React from "react";
import { stringUtil } from "utils";

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
          const payloadAsNumber = Number(action.payload);
          const value = isNaN(payloadAsNumber) ? setting[action.field] : payloadAsNumber;
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
          const payloadAsNumber = Number(action.payload);
          const value = isNaN(payloadAsNumber) ? setting.start : payloadAsNumber;
          if (value > setting.end) {
            // Supaya nilai `end` gak lebih kecil dari `start`
            // kasih suggestion nilai `end` minimal sama dengan `start`
            return { ...setting, start: value || "", end: value || "" };
          }
          return { ...setting, start: value || "" };
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
          const payloadAsNumber = Number(action.payload);
          const value = isNaN(payloadAsNumber) ? setting.start : payloadAsNumber;
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

export { useFormBudrestSettings };
