import * as React from "react";
import { errorsUtil } from "utils";

/**
 * Operasi asinkronus untuk komunikasi dengan API.
 * Nge-track status operasi async-nya juga selain datanya.
 * Hanya kompatibel dengan service API custom My Archery.
 * @returns {Object} { status, data, errors, state, runAsync, isInitialLoading, isLoading, isSuccess, isError }
 */
function useFetcher() {
  const [state, unsafeDispatch] = React.useReducer(fetcherReducer, {
    status: "idle",
    data: null,
    errors: null,
  });
  const isMounted = useUnmountChecker();
  const { status } = state;

  const dispatch = React.useCallback(
    (action) => {
      // Cegah memory leak
      // Gak perlu update state kalau sudah unmount
      // tapi handler sukses & error tetep dipanggil
      isMounted.current && unsafeDispatch(action);
    },
    [unsafeDispatch]
  );

  const runAsync = async (serviceFetcher, { onSuccess, onError, transform } = {}) => {
    if (typeof serviceFetcher !== "function") {
      return;
    }

    dispatch({ status: "loading", errors: null });
    // TODO: abort controller (?)
    const result = await serviceFetcher();

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

  const isInit = status === "idle";
  const isInitialLoading = !state.data && status === "loading";
  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  return {
    ...state,
    state,
    runAsync,
    reset,
    isInit,
    isInitialLoading,
    isLoading,
    isSuccess,
    isError,
  };
}

function fetcherReducer(state, action) {
  if (action.type === "REFETCH") {
    return { ...state, attempts: state.attempts + 1 };
  }

  if (action.type === "RESET") {
    return {
      status: "idle",
      data: typeof action.payload !== "undefined" ? action.payload : null,
      errors: null,
      attempts: 1,
    };
  }

  return { ...state, ...action };
}

/* ======================================== */

function useUnmountChecker() {
  const isMountedRef = React.useRef(false);
  // Cek mounting komponen
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return isMountedRef;
}

/* ======================================== */
// utils

function _handleReturnedData(data, transformFn) {
  // Data yang di-return API bisa saja `null` meskipun sukses 200,
  // dan function transformnya gak perlu dijalanin biar gak error/explode.
  if (!data || typeof transformFn !== "function") {
    return data;
  }
  return transformFn(data);
}

export { useFetcher };
