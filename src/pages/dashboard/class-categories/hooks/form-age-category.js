import * as React from "react";
import { parseAgeCategoryResponseData } from "../utils";

function useFormAgeCategory(initialFormValues) {
  const initialData = initialFormValues || {
    label: "",
    criteria: 1,
    ageValidator: null,
    asDate: false,
    min: null,
    max: null,
  };

  const [form, dispatch] = React.useReducer(formReducer, {
    data: initialData,
    errors: null,
  });

  React.useEffect(() => {
    if (!initialFormValues) {
      return;
    }
    dispatch({ type: "INIT", payload: initialFormValues });
  }, [initialFormValues]);

  const setLabel = (label) => dispatch({ label: label });
  const setCriteria = (criteria) => dispatch({ type: "CHANGE_CRITERIA", payload: criteria });
  const setAgeValidator = (ageValidator) => {
    dispatch({ type: "CHANGE_AGE_VALIDATOR", payload: ageValidator });
  };
  const toggleAsDate = () => dispatch({ type: "TOGGLE_AS_DATE" });
  const setMin = (min) => dispatch({ type: "CHANGE_MIN", payload: min });
  const setMax = (max) => dispatch({ type: "CHANGE_MAX", payload: max });

  return { ...form, setLabel, setCriteria, setAgeValidator, toggleAsDate, setMin, setMax };
}

function formReducer(state, action) {
  if (action.type === "INIT") {
    return { ...state, data: _makeInitialForm(action.payload) };
  }

  if (action.type === "CHANGE_CRITERIA") {
    return {
      ...state,
      data: {
        ...state.data,
        criteria: action.payload,
        // reset
        ageValidator: "min",
        asDate: false,
        min: null,
        max: null,
      },
    };
  }

  if (action.type === "CHANGE_AGE_VALIDATOR") {
    const resetedStates = {
      min: state.data.max,
      max: state.data.min,
    };

    if (action.payload === "range") {
      resetedStates.min = state.data.min || state.data.max || null;
      resetedStates.max = state.data.min || state.data.max || null;
    } else if (action.payload === "min") {
      resetedStates.min = state.data.max;
      resetedStates.max = null;
    } else if (action.payload === "max") {
      resetedStates.min = null;
      resetedStates.max = state.data.min;
    }

    return {
      ...state,
      data: {
        ...state.data,
        ageValidator: action.payload,
        ...resetedStates,
      },
    };
  }

  if (action.type === "TOGGLE_AS_DATE") {
    return {
      ...state,
      data: {
        ...state.data,
        asDate: !state.data.asDate,
        // reset
        min: null,
        max: null,
      },
    };
  }

  if (action.type === "CHANGE_MIN") {
    const resetedStates = {};

    if (state.data.ageValidator === "min") {
      resetedStates.max = null;
    }

    return {
      ...state,
      data: {
        ...state.data,
        min: state.data.asDate ? action.payload : parseInt(action.payload),
        ...resetedStates,
      },
    };
  }

  if (action.type === "CHANGE_MAX") {
    const resetedStates = {};

    if (state.data.ageValidator === "max") {
      resetedStates.min = null;
    }
    return {
      ...state,
      data: {
        ...state.data,
        max: state.data.asDate ? action.payload : parseInt(action.payload),
        ...resetedStates,
      },
    };
  }

  if (action) {
    return { ...state, data: { ...state.data, ...action } };
  }

  return state;
}

function _makeInitialForm(payload) {
  return parseAgeCategoryResponseData(payload);
}

export { useFormAgeCategory };
