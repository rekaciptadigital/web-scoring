import * as React from "react";
import { fetchingReducer } from "./fetcher";

import { errorsUtil } from "utils";

/**
 *
 * @returns {Object} { status, data, errors, state, runAsync, isLoading, isSuccess, isError }
 */
function useFetcher() {
  const [state, dispatch] = React.useReducer(fetchingReducer, {
    status: "idle",
    data: null,
    errors: null,
  });

  const { status } = state;

  const runAsync = async (serviceFetcher, { onSuccess, onError, transform } = {}) => {
    if (typeof serviceFetcher !== "function") {
      return;
    }

    dispatch({ status: "loading", errors: null });
    const result = await serviceFetcher();

    // TODO: abort controller & cancel state update on unmount

    if (result.success) {
      const data = typeof transform === "function" ? transform(result.data) : result.data;
      dispatch({ status: "success", data: data });
      onSuccess?.(data);
    } else {
      const fetchingErrors = errorsUtil.interpretServerErrors(result);
      dispatch({ status: "error", errors: fetchingErrors });
      onError?.(fetchingErrors);
    }
  };

  const isInit = status === "idle";
  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return { ...state, state, runAsync, isInit, isLoading, isSuccess, isError };
}

export { useFetcher };
