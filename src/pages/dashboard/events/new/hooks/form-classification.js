import React from "react";

const initialState = {
  classification: [
    { label: "Klub", value: "club" },
    { label: "Negara", value: "country" },
    { label: "Wilayah Provinsi", value: "provinsi" },
    { label: "Wilayah Kota", value: "city" },
    {
      label: "Buat/Edit Klasifikasi",
      value: "newClassification",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="red"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 4.16797V15.8346"
            stroke="#757575"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.16797 10H15.8346"
            stroke="#757575"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ],
  newClassification: {},
  currentView: 1,
};

const useClassification = () => {
  const [state, dispatch] = React.useReducer(
    classificationAction,
    initialState
  );

  const setClassification = (value) => {
    dispatch({ type: "ADD_CLASSIFICATION_CATEGORY", payload: value });
  };

  const setNewClassification = (value) => {
    dispatch({ type: "ADD_NEW_CLASSIFICATION_CATEGORY", payload: value });
  };

  const setChangeView = (value) => {
    dispatch({ type: "CHANGE_VIEW", payload: value });
  };

  return {
    ...state,
    setClassification,
    setChangeView,
    setNewClassification,
  };
};

const classificationAction = (state, action) => {
  switch (action.type) {
    case "ADD_CLASSIFICATION_CATEGORY": {
      const categories = [...state.classification];
      const newCategories = categories.filter(
        (classification) => classification?.value === action.payload?.value
      );
      if (!newCategories.length) {
        categories.splice(state.classification?.length - 1, 0, action.payload);
      }
      return { ...state, classification: categories };
    }
    case "CHANGE_VIEW":
      return { ...state, currentView: action.payload };
    case "ADD_NEW_CLASSIFICATION_CATEGORY":
      return { ...state, newClassification: action.payload };
  }
};

export { useClassification };
