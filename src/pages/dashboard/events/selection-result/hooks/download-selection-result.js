import { useFetcher } from "hooks/alt-fetcher";
import { ScoringService } from "services";

import { urlUtil } from "utils";

function useDownloadSelectionResult(eventId) {
  const fetcher = useFetcher();

  const download = async (customOptions) => {
    const getFunction = () => {
      return ScoringService.getSelectionResultDownloadUrl({ event_id: eventId });
    };
    const options = {
      ...customOptions,
      onSuccess: (data) => {
        customOptions.onSuccess?.(data);
        urlUtil.openUrlOnNewTab(data?.filePath);
      },
    };
    fetcher.runAsync(getFunction, options);
  };

  return { ...fetcher, download };
}

export { useDownloadSelectionResult };
