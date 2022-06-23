import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

import { urlUtil } from "utils";

function useDownloadScoresheet({ categoryId, eliminationId, round, match }) {
  const fetcher = useFetcher();

  const downloadScoresheet = async ({ onSuccess: consumerSuccessHandler, onError }) => {
    if (!eliminationId || !round || !match) {
      // TODO: lempar error harusnya?
      return;
    }

    const getFunction = () => {
      return ScoringService.getScoresheetEliminationDownloadUrl({
        category_id: categoryId,
        event_elimination_id: eliminationId,
        round: round,
        match: match,
      });
    };

    const onSuccess = (data) => {
      consumerSuccessHandler?.();
      const downloadUrl = _handleURLFromResponse(data);
      urlUtil.openUrlOnNewTab(downloadUrl);
    };

    fetcher.runAsync(getFunction, { onSuccess, onError });
  };

  return { ...fetcher, downloadScoresheet };
}

// utils
function _handleURLFromResponse(url) {
  const API_URL = process.env.REACT_APP_API_URL || "https://api-staging.myarchery.id";
  const segments = url.split("/");
  const assetSegmentIndex = segments.findIndex((segment) => segment === "asset");
  const downloadUrl = API_URL + "/" + segments.slice(assetSegmentIndex).join("/");
  return downloadUrl;
}

export { useDownloadScoresheet };
