import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

import { urlUtil, misc } from "utils";

function useDownloadScoresheetByRound({ categoryId, eliminationId, round }) {
  const fetcher = useFetcher();

  const download = React.useCallback(
    async (customOptions = {}) => {
      const getFunction = () => {
        const qs = {
          category_id: categoryId,
          event_elimination_id: eliminationId,
          round: round,
        };
        return ScoringService.getScoresheetEliminationDownloadUrlByRound(qs);
      };

      const options = {
        ...customOptions,
        onSuccess: async (data) => {
          customOptions.onSuccess?.();
          await misc.sleep(450);
          urlUtil.openUrlOnNewTab(data.fileName);
        },
      };

      fetcher.runAsync(getFunction, options);
    },
    [categoryId, eliminationId, round]
  );

  return { ...fetcher, download };
}

export { useDownloadScoresheetByRound };
