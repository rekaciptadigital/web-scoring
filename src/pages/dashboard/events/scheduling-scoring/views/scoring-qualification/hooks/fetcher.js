import * as React from "react";

function useFetcher(fetcherFunction, configs) {
  const [state, dispatch] = React.useReducer(fetchingReducer, {
    status: "idle",
    data: null,
    errors: null,
    attempts: 1,
  });

  const { attempts } = state;

  React.useEffect(() => {
    const shouldPreventFetch = () => {
      if (!configs || typeof configs.shouldFetch === "undefined") {
        return false;
      }
      return !configs.shouldFetch;
    };

    if (shouldPreventFetch()) {
      return;
    }

    const fetchData = async () => {
      dispatch({ status: "loading", errors: null });
      const result = await fetcherFunction();
      if (result.success) {
        dispatch({ status: "success", data: result.data });
      } else {
        dispatch({ status: "error", errors: result.errors || result.message });
      }
    };
    fetchData();
  }, [attempts]);

  const refetch = () => dispatch({ type: "REFETCH" });

  return { ...state, state, dispatch, refetch };
}

function fetchingReducer(state, action) {
  if (action.type === "REFETCH") {
    return { ...state, attempts: state.attempts + 1 };
  }
  return { ...state, ...action };
}

export { useFetcher };
