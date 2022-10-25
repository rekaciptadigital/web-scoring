import { useFetcher } from "hooks/alt-fetcher";
import { ScoringService } from "services";

import { urlUtil } from "utils";

function useDownloadBaganElimination(eventId, eventCategoryId) {
  const fetcher = useFetcher();

  const download = async (customOptions) => {
    if (!eventCategoryId) {
      return;
    }
    const getFunction = () => {
      return ScoringService.getDownloadBaganElimination({
        event_id: eventId,
        category_id: eventCategoryId,
      });
    };
    const options = {
      ...customOptions,
      onSuccess: (data) => {
        customOptions.onSuccess?.(data);
        urlUtil.openUrlOnNewTab(data.filePath);
      },
    };
    fetcher.runAsync(getFunction, options);
  };

  return { ...fetcher, download };
}

export { useDownloadBaganElimination };
