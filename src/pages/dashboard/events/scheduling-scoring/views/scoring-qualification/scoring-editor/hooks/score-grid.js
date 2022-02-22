import * as React from "react";

const initialState = {
  status: "idle",
  data: {
    1: ["", "", "", "", "", ""],
    2: ["", "", "", "", "", ""],
    3: ["", "", "", "", "", ""],
    4: ["", "", "", "", "", ""],
    5: ["", "", "", "", "", ""],
    6: ["", "", "", "", "", ""],
  },
  errors: null,
};

function useScoreGrid(gridData) {
  const [state, dispatch] = React.useReducer(gridReducer, initialState);

  const setScore = ({ rambahan, shot, value }) => dispatch({ rambahan, shot, value });
  const resetGrid = () => dispatch({ type: "RESET", initialGrid: gridData });
  const dispatchSubmit = (action) => dispatch({ type: "SUBMIT", payload: action });

  React.useEffect(() => {
    if (!gridData) {
      return;
    }
    dispatch({ type: "INIT", payload: gridData });
  }, [gridData]);

  return { ...state, state, setScore, resetGrid, dispatchSubmit };
}

function gridReducer(state, action) {
  if (action.type === "INIT") {
    return { ...state, data: transformGridData(action.payload) };
  }

  if (action.type === "RESET") {
    return { ...initialState, data: transformGridData(action.initialGrid) };
  }

  if (action.type === "SUBMIT") {
    return { ...state, ...action.payload };
  }

  const { rambahan, shot, value } = action;
  return {
    ...state,
    data: {
      ...state.data,
      [rambahan]: state.data[rambahan].map((previousScore, shotIndex) =>
        shotIndex === shot ? value : previousScore
      ),
    },
  };
}

// util
function transformGridData(data) {
  const transformedGrid = {};
  for (const id in data) {
    transformedGrid[id] = data[id].map((score) => {
      return isNaN(score) || !score ? score : Number(score);
    });
  }
  return transformedGrid;
}

export { useScoreGrid };
