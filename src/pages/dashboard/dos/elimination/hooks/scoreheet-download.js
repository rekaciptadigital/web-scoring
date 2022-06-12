import { useFetcher } from "utils/hooks/alt-fetcher";
import { DosService } from "services";

import { urlUtil } from "utils";

function useScoresheetDownload(eventCategoryId) {
  const fetcher = useFetcher();

  const handleDownloadScoresheet = async ({ onSuccess: consumerSuccessHandler }) => {
    if (!eventCategoryId) {
      return;
    }

    const queryString = { event_category_id: eventCategoryId };

    const getFunction = () => {
      return DosService.getEliminationDownloadUrl(queryString);
    };
    const onSuccess = (data) => {
      consumerSuccessHandler?.();
      const downloadUrl = _handleURLFromResponse(data);
      urlUtil.openUrlOnNewTab(downloadUrl);
    };

    fetcher.runAsync(getFunction, { onSuccess });
  };

  return { ...fetcher, handleDownloadScoresheet };
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
