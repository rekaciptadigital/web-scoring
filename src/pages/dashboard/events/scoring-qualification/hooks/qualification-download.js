import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

import { urlUtil } from "utils";

function useQualificationDownload(eventId,eventCategoryId) {
  const fetcher = useFetcher();

  const download = async ({ onSuccess, ...options }) => {
    if (!eventCategoryId) {
      return;
    }

    const getFunction = () => {
      return ScoringService.getDownloadQualifficationRank({
        event_id : eventId,
        category_id: eventCategoryId,
      });
    };

    fetcher.runAsync(getFunction, {
      ...options,
      onSuccess: (data) => {
        onSuccess?.();
        const downloadUrl = _handleURLFromResponse(data.filePath);
        urlUtil.openUrlOnNewTab(downloadUrl);
      },
    });
  };

  return { ...fetcher, download };
}

// utils
function _handleURLFromResponse(url) {
  const API_URL = process.env.REACT_APP_API_URL || "https://api-staging.myarchery.id";
  const segments = url.split("/");
  const assetSegmentIndex = segments.findIndex((segment) => segment === "asset");
  const downloadUrl = API_URL + "/" + segments.slice(assetSegmentIndex).join("/");
  return downloadUrl;
}

export { useQualificationDownload };
