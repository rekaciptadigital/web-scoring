import * as React from "react";

const STATUS_CLEAN = "clean";
const STATUS_DIRTY = "dirty";

// TODO: validasi field instan/on change & on submit

function useProfileForm(userProfile = null) {
  const initialState = React.useMemo(() => _makeInitialState(userProfile), [userProfile]);
  const [state, dispatch] = React.useReducer(formReducer, initialState);

  // Untuk cek lebih dalam apakah data user profile yang di-get ulang ternyata gak berubah
  const isUnchanged = React.useMemo(
    () => _checkFormStatus(state.initialData, initialState.data) === STATUS_CLEAN,
    [state.initialData, initialState]
  );

  React.useEffect(() => {
    if (isUnchanged) {
      return;
    }
    dispatch({ type: "INIT", payload: _makeInitialState(userProfile) });
  }, [isUnchanged, userProfile]);

  const status = React.useMemo(
    () => _checkFormStatus(state.initialData, state.data),
    [state.initialData, state.data]
  );

  const isClean = status === STATUS_CLEAN;
  const isDirty = status === STATUS_DIRTY;

  const setValue = (fieldName, value) => {
    dispatch({ type: "UPDATE_FIELD_VALUE", field: fieldName, payload: value });
  };

  return { values: state.data, setValue, isClean, isDirty };
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

function _makeInitialState(userProfile) {
  if (!userProfile) {
    return {
      initialData: null,
      data: null,
      errors: null,
    };
  }
  const initialData = {
    name: userProfile.name,
    email: userProfile.email,
    provinceId: userProfile.provinceId,
    cityId: userProfile.cityId,
    phone: userProfile.phoneNumber,
  };
  return {
    // cache data awal dari profil
    initialData,
    // data untuk field yang sedang "live", yang bisa diubah-ubah
    data: { ...initialData },
    errors: null,
  };
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

export { useProfileForm };
