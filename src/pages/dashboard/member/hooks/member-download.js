import { useFetcher } from "utils/hooks/alt-fetcher";
import { IdCardService } from "services";

import { urlUtil } from "utils";

function useMemberDownload(eventCategoryId, eventId) {
  const fetcher = useFetcher();

  const handleDownloadIdCard = async ({ onSuccess: consumerSuccessHandler }) => {
    if (!eventCategoryId) {
      return;
    }

    const queryString = { category_id: eventCategoryId, event_id: eventId, type: 1 };

    const getFunction = () => {
      return IdCardService.getDownloadIdCard(queryString);
    };
    const onSuccess = (data) => {
      consumerSuccessHandler?.();
      const downloadUrl = _handleURLFromResponse(data);
      console.log(downloadUrl, 'ratata');
      urlUtil.openUrlOnNewTab(downloadUrl);
    };

    fetcher.runAsync(getFunction, { onSuccess });
  };

  return { ...fetcher, handleDownloadIdCard };
}

// utils
function _handleURLFromResponse(url) {
  const API_URL = process.env.REACT_APP_API_URL || "https://api-staging.myarchery.id";
  const segments = url.split("/");
  const assetSegmentIndex = segments.findIndex((segment) => segment === "storage");
  const downloadUrl = API_URL + "/" + segments.slice(assetSegmentIndex).join("/");
  return downloadUrl;
}

export { useMemberDownload };
