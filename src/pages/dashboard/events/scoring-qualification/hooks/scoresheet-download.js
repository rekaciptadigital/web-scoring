import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

import { urlUtil } from "utils";

function useScoresheetDownload(eventCategoryId) {
  const fetcher = useFetcher();

  const download = async (sessionNumber, { onSuccess, ...options }) => {
    if (!eventCategoryId) {
      return;
    }

    const getFunction = () => {
      return ScoringService.getScoresheetDownloadUrl({
        event_category_id: eventCategoryId,
        session: sessionNumber,
      });
    };

    fetcher.runAsync(getFunction, {
      ...options,
      onSuccess: (data) => {
        onSuccess?.();
        const downloadUrl = _handleURLFromResponse(data);
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

export { useScoresheetDownload };
