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
      const data = _handleReturnedData(result.data, transform);
      dispatch({ status: "success", data: data });
      onSuccess?.(data);
    } else {
      const fetchingErrors = errorsUtil.interpretServerErrors(result);
      dispatch({ status: "error", errors: fetchingErrors });
      onError?.(fetchingErrors);
    }
  };

  const reset = () => dispatch({ type: "RESET" });

  // TODO: buat pembeda status antara `isLoading` & `isFetching`
  const isInit = status === "idle";
  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return { ...state, state, runAsync, reset, isInit, isLoading, isSuccess, isError };
}

function _handleReturnedData(data, transformFn) {
  // Data yang di-return API bisa saja `null` meskipun sukses 200,
  // dan function transformnya gak perlu dijalanin biar gak error/explode.
  if (!data || typeof transformFn !== "function") {
    return data;
  }
  return transformFn(data);
}

export { useFetcher };
