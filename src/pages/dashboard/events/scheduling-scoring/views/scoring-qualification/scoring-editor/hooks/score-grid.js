import * as React from "react";

const initialState = {
  status: "idle",
  data: {
    1: ["m", "m", "m", "m", "m", "m"],
    2: ["m", "m", "m", "m", "m", "m"],
    3: ["m", "m", "m", "m", "m", "m"],
    4: ["m", "m", "m", "m", "m", "m"],
    5: ["m", "m", "m", "m", "m", "m"],
    6: ["m", "m", "m", "m", "m", "m"],
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
    const nextGridData = {};
    for (const id in action.payload) {
      nextGridData[id] = action.payload[id].map((score) => score);
    }
    return { ...state, data: nextGridData };
  }

  if (action.type === "RESET") {
    return { ...initialState, data: action.initialGrid };
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

export { useScoreGrid };
