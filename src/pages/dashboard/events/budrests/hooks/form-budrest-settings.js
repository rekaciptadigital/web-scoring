import * as React from "react";
import { stringUtil, misc } from "utils";

function useFormBudrestSettings(initialSettingsData) {
  const [state, dispatch] = React.useReducer(formReducer, {
    data: makeInitialState(initialSettingsData),
    status: "",
  });

  const errors = validateValues(state.data);
  const isSubmitAllowed = hasAnyParticipants(state.data) && shouldSubmitAllowed(errors);

  const getValidationProps = (key, fieldName) => {
    return {
      // keliatan ruwet... ini cuma bikin pesan error sebagai array string
      errors: errors?.[key]?.[fieldName] ? [errors[key][fieldName]] : undefined,
      isTouched: state.touched?.[key]?.[fieldName],
      onBlur: () => {
        dispatch({ type: "FIELD_TOUCHED", key: key, field: fieldName });
      },
    };
  };

  const resetFormState = () => dispatch({ type: "FORM_RESET" });

  const updateField = (key, fieldName, value) => {
    dispatch({ type: "FIELD_UPDATE", key: key, field: fieldName, payload: value });
  };

  const updateFieldStart = (key, value) => {
    dispatch({ type: "UPDATE_FIELD_START", key: key, payload: value });
  };

  const updateFieldEnd = (key, value) => {
    dispatch({ type: "UPDATE_FIELD_END", key: key, payload: value });
  };

  const updateFieldTargetFace = (key, value) => {
    dispatch({ type: "UPDATE_FIELD_TARGET_FACE", key: key, payload: value });
  };

  return {
    ...state,
    updateField,
    updateFieldStart,
    updateFieldEnd,
    updateFieldTargetFace,
    errors,
    isSubmitAllowed,
    getValidationProps,
    resetFormState,
  };
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

    case "FIELD_TOUCHED": {
      return {
        ...state,
        touched: {
          ...(state.touched || {}),
          [action.key]: {
            ...(state.touched?.[action.key] || {}),
            [action.field]: true,
          },
        },
      };
    }

    case "FORM_RESET": {
      return { data: state.data, status: state.status };
    }

    case "UPDATE_FIELD_START": {
      return {
        ...state,
        data: state.data.map((setting) => {
          if (setting.key !== action.key) {
            return setting;
          }
          const inputValueStart = misc.convertAsNumber(action.payload, setting.start);
          const endNumber = computeEndNumber(
            inputValueStart,
            misc.convertAsNumber(setting.totalParticipant),
            misc.convertAsNumber(setting.targetFace),
            setting.end
          );
          return {
            ...setting,
            start: inputValueStart || "",
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

    case "UPDATE_FIELD_TARGET_FACE": {
      return {
        ...state,
        data: state.data.map((setting) => {
          if (setting.key !== action.key) {
            return setting;
          }
          const inputValueTargetFace = misc.convertAsNumber(action.payload, setting.targetFace);
          const endNumber = computeEndNumber(
            setting.start,
            misc.convertAsNumber(setting.totalParticipant),
            inputValueTargetFace,
            setting.end
          );
          return {
            ...setting,
            targetFace: inputValueTargetFace || "",
            end: endNumber || "",
          };
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

function validateValues(data) {
  if (!data) {
    return null;
  }

  const errors = {};
  for (const setting of data) {
    // Yang gak ada peserta gak perlu divalidasi
    if (!setting.totalParticipant) {
      continue;
    }
    errors[setting.key] = {
      start: !setting.start ? "Wajib" : false,
      end: !setting.end ? "Wajib" : false,
      targetFace: !setting.targetFace ? "Wajib" : false,
    };
  }
  return errors;
}

function shouldSubmitAllowed(errors) {
  if (!errors) {
    return true;
  }

  let errorsCount = 0;
  const settingKeys = Object.keys(errors);
  for (const key of settingKeys) {
    const fieldNames = Object.keys(errors[key]);

    for (const field of fieldNames) {
      if (!errors[key][field]) {
        continue;
      }
      errorsCount = errorsCount + 1;
      break;
    }

    if (errorsCount) {
      break;
    }
  }

  return errorsCount === 0;
}

function hasAnyParticipants(data) {
  if (!data) {
    return false;
  }
  return data.some((setting) => setting.totalParticipant > 0);
}

function computeEndNumber(startNumber, totalParticipant, numbersOfTargetFace, fallback = 0) {
  if (!startNumber || !totalParticipant || !numbersOfTargetFace) {
    return fallback;
  }

  const numbersOfRequiredBudrests = Math.ceil(totalParticipant / numbersOfTargetFace);
  const range = numbersOfRequiredBudrests - 1;
  const resultEndNumber = startNumber + range;

  return resultEndNumber;
}

export { useFormBudrestSettings };
