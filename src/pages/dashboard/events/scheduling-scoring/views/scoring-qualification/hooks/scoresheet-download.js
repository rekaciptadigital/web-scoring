import * as React from "react";
import { fetchingReducer } from "utils/hooks/fetcher";
import { ScoringService } from "services";

import { errorsUtil, urlUtil } from "utils";
import { handleUrlFromResponse } from "../utils";

function useScoresheetDownload() {
  const [state, dispatch] = React.useReducer(fetchingReducer, {
    status: "idle",
    data: null,
    errors: null,
  });

  const handleScoresheetDownload = async (eventCategoryId) => {
    if (!eventCategoryId) {
      return;
    }

    dispatch({ status: "loading", errors: null });
    const queryString = { event_category_id: eventCategoryId };
    const result = await ScoringService.getScoresheetDownloadUrl(queryString);

    if (result.success) {
      dispatch({ status: "success", data: result.data });
      const downloadUrl = handleUrlFromResponse(result.data);
      urlUtil.openUrlOnNewTab(downloadUrl);
    } else {
      const downloadErrors = errorsUtil.interpretServerErrors(result);
      dispatch({ status: "error", errors: downloadErrors });
    }
  };

  return { ...state, state, handleScoresheetDownload };
}

export { useScoresheetDownload };
