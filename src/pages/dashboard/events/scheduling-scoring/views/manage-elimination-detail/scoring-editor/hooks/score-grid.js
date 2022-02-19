import * as React from "react";

function makeDefaultData() {
  return {
    shot: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    stats: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
    extraShot: [
      { score: "", distanceFromX: 0 },
      { score: "", distanceFromX: 0 },
      { score: "", distanceFromX: 0 },
    ],
  };
}

const initialState = {
  status: "idle",
  data: makeDefaultData(),
  errors: null,
};

function useScoreGrid(scoresData) {
  const [state, dispatch] = React.useReducer(gridReducer, initialState);

  const updateShot = ({ rambahan, shot, value }) => {
    dispatch({ type: "CHANGE_SHOT", rambahan, shot, value });
  };
  const updateExtraShot = ({ shot, value }) => dispatch({ type: "CHANGE_EXTRA", shot, value });
  const resetGrid = () => dispatch({ type: "RESET", initialGrid: scoresData });
  const dispatchSubmit = (action) => dispatch({ type: "SUBMIT", payload: action });

  React.useEffect(() => {
    console.log(scoresData);
    if (!scoresData) {
      return;
    }
    dispatch({ type: "INIT", payload: scoresData });
  }, [scoresData]);

  return { ...state, state, updateShot, updateExtraShot, resetGrid, dispatchSubmit };
}

function gridReducer(state, action) {
  if (action.type === "INIT") {
    return { ...state, data: transformGridData(action.payload) };
  }

  if (action.type === "CHANGE_SHOT") {
    return {
      ...state,
      data: {
        ...state.data,
        shot: state.data.shot.map((row, index) => {
          if (index !== action.rambahan) {
            return row;
          }
          return row.map((column, index) => {
            if (index !== action.shot) {
              return column;
            }
            return action.value;
          });
        }),
      },
    };
  }

  if (action.type === "CHANGE_EXTRA") {
    return {
      ...state,
      data: {
        ...state.data,
        extraShot: state.data.extraShot.map((column, index) => {
          if (index !== action.shot) {
            return column;
          }
          return { ...column, ...action.value };
        }),
      },
    };
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
const handleScoreType = (score) => (isNaN(score) || !score ? score : Number(score));

function transformGridData(data) {
  const transformedShot = data.shot.map((rambahan) => {
    return rambahan.score.map((item) => handleScoreType(item));
  });

  const stats = {};
  data.shot.forEach((shot, index) => {
    stats[index] = { total: shot.total, point: shot.point };
  });

  return {
    shot: transformedShot,
    stats: stats,
    extraShot: data.extraShot.slice(2).map((shot) => ({
      score: handleScoreType(shot.score),
      distanceFromX: handleScoreType(shot.distanceFromX),
    })),
  };
}

export { useScoreGrid };
