import { useFetcher } from "hooks/alt-fetcher";
import { ScoringService } from "services";

import { urlUtil } from "utils";

function useScoresheetDownloadSelection(eventCategoryId) {
  const fetcher = useFetcher();

  const download = async (sessionNumber, customOptions) => {
    if (!eventCategoryId) {
      return;
    }
    const getFunction = () => {
      return ScoringService.getScoresheetSelectionDownloadUrl({
        event_category_id: eventCategoryId,
        session: sessionNumber,
      });
    };
    const options = {
      ...customOptions,
      onSuccess: (data) => {
        customOptions.onSuccess?.(data);
        urlUtil.openUrlOnNewTab(data);
      },
    };
    fetcher.runAsync(getFunction, options);
  };

  return { ...fetcher, download };
}

export { useScoresheetDownloadSelection };
