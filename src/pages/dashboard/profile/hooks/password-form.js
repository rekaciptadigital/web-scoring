import * as React from "react";

const STATUS_CLEAN = "clean";
const STATUS_DIRTY = "dirty";

const initialState = {
  data: { password_old: "", password: "", password_confirmation: "" },
  errors: null,
};

function usePasswordForm() {
  const [state, dispatch] = React.useReducer(formReducer, initialState);
  const status = React.useMemo(() => _checkFormStatus(initialState.data, state.data), [state.data]);
  const isClean = status === STATUS_CLEAN;
  const isDirty = status === STATUS_DIRTY;
  const isValid = _checkFormValidation(state.data);

  const setValue = (fieldName, value) => {
    dispatch({ type: "UPDATE_FIELD_VALUE", field: fieldName, payload: value });
  };

  return { values: state.data, setValue, isClean, isDirty, isValid };
}

function formReducer(state, action) {
  if (action.type === "INIT") {
    return action.payload;
  }
  if (action.type === "UPDATE_FIELD_VALUE") {
    const formData = {
      ...state.data,
      [action.field]: action.payload,
    };
    return { ...state, data: formData };
  }
  return state;
}

function _checkFormStatus(initialData, formData) {
  const status = [];
  for (const field in formData) {
    const fieldStatus = formData[field] === initialData[field] ? STATUS_CLEAN : STATUS_DIRTY;
    status.push(fieldStatus);
  }
  const isAllClean = status.every((field) => field === STATUS_CLEAN);
  return isAllClean ? STATUS_CLEAN : STATUS_DIRTY;
}

function _checkFormValidation(formData) {
  // Sementara masih cek supaya required semua.
  // Belum ada cek minimal length maupun kriteria lainnya.
  const status = [];
  for (const field in formData) {
    if (!formData[field]) {
      status.push(true);
      break;
    }
  }
  return !status.length;
}

export { usePasswordForm };
