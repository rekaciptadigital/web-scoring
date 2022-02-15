import * as React from "react";

function useScoringDetail({ code = "1-31", type = 1, scheduleId = 31 } = {}) {
  const [state, dispatch] = React.useReducer(scoreDetailReducer, {
    status: "idle",
    data: null,
    errors: null,
    attempts: 1,
  });

  const { attempts } = state;
  const refetch = () => dispatch({ type: "REFETCH" });

  React.useEffect(() => {
    const fetchData = async () => {
      dispatch({ status: "loading", errors: null });

      // TODO: ganti ke service beneran
      const result = await FakeService.getScoringDetail({ code, type, scheduleId });

      if (result.success) {
        dispatch({ status: "success", data: result.data });
      } else {
        dispatch({ status: "error", errors: result.errors || result.message });
      }
    };
    fetchData();
  }, [attempts]);

  return { ...state, state, dispatch, refetch };
}

function scoreDetailReducer(state, action) {
  if (action.type === "REFETCH") {
    return { ...state, attempts: state.attempts + 1 };
  }
  if (action.type === "CHANGE_TARGET_NO") {
    return { ...state, data: { ...state.data, targetNo: action.payload } };
  }
  if (action.type === "CHANGE_SHOT_SCORE") {
    const { session, rambahan, shot, value } = action.payload;
    return {
      ...state,
      data: {
        ...state.data,
        sessions: {
          ...state.data.sessions,
          [session]: {
            ...state.data.sessions[session],
            scores: {
              ...state.data.sessions[session].scores,
              [rambahan]: state.data.sessions[session].scores[rambahan].map((shotScore, index) =>
                index === shot ? value : shotScore
              ),
            },
          },
        },
      },
    };
  }
  return { ...state, ...action };
}

function createMockData(params) {
  return {
    id: params.id || 1,
    type: params.type,
    scheduleId: params.scheduleId,
    code: params.code,
    targetNo: "5B",
    sessions: {
      1: {
        scores: {
          1: [2, "m", "m", "m", "m", "m"],
          2: ["m", "x", "m", 7, "m", "m"],
          3: ["m", "m", "m", "m", "m", "m"],
          4: [10, "m", "m", "m", "m", "m"],
          5: ["m", "m", "m", "m", "m", "m"],
          6: ["m", "m", "m", "m", "m", "m"],
        },
        total: 0,
        xCounts: 0,
        x10Counts: 0,
      },
      2: {
        scores: {
          1: ["m", "m", "m", "m", "m", "m"],
          2: ["m", "m", "m", "m", "m", "m"],
          3: ["m", "m", "m", "m", "m", "m"],
          4: ["m", "m", "m", "m", "m", "m"],
          5: ["m", "m", "m", "m", "m", "m"],
          6: ["m", "m", "m", "m", "m", "m"],
        },
        total: 0,
        xCounts: 0,
        x10Counts: 0,
      },
      3: {
        scores: {
          1: ["m", "m", "m", "m", "m", "m"],
          2: ["m", "m", "m", "m", "m", "m"],
          3: ["m", "m", "m", "m", "m", "m"],
          4: ["m", "m", "m", "m", "m", "m"],
          5: ["m", "m", "m", "m", "m", "m"],
          6: ["m", "m", "m", "m", "m", "m"],
        },
        total: 0,
        xCounts: 0,
        x10Counts: 0,
      },
    },
  };
}

const FakeService = {};
FakeService.getScoringDetail = function (params) {
  const data = createMockData({ id: 12, ...params });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data, params });
    }, 800);
  });
};

export { useScoringDetail };
