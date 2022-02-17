import { useFetcher, fetchingReducer } from "../../hooks/fetcher";
import { ScoringService } from "services";

function useScoringDetail({ code } = {}) {
  const getScoringDetail = () => {
    return ScoringService.findParticipantScoreDetail({ code });
  };
  return useFetcher(getScoringDetail, { reducer: scoreDetailReducer });
}

function scoreDetailReducer(state, action) {
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
  return fetchingReducer(state, action);
}

export { useScoringDetail };
