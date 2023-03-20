import React from "react";

const initialState = {
  isUseVerify: false,
  isConfigureActive: false,
};

const useFormCheck = () => {
  const [state, dispatch] = React.useReducer(verifyReducer, initialState);

  const setIsUseVerify = (value) => {
    dispatch({ type: "CHANGE_VERIVY_PARTICIPANT", payload: value });
  };
  const setIsConfigureActive = (value) => {
    dispatch({ type: "CHANGE_CONFIGURE", payload: value });
  };

  return { state: { ...state }, setIsUseVerify, setIsConfigureActive };
};

const verifyReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_VERIVY_PARTICIPANT":
      return { ...state, isUseVerify: action.payload };
    case "CHANGE_CONFIGURE":
      return { ...state, isConfigureActive: action.payload };
    default:
      break;
  }
};

export { useFormCheck };
