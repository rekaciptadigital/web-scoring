import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

import { urlUtil, misc } from "utils";

function useDownloadBlankScoresheet({ categoryId }) {
  const fetcher = useFetcher();

  const download = React.useCallback(
    async (customOptions = {}) => {
      const getFunction = () => {
        const qs = { category_id: categoryId };
        return ScoringService.getBlankScoresheetEliminationUrl(qs);
      };

      const options = {
        ...customOptions,
        onSuccess: async (data) => {
          customOptions.onSuccess?.();
          await misc.sleep(450);
          urlUtil.openUrlOnNewTab(data);
        },
      };

      fetcher.runAsync(getFunction, options);
    },
    [categoryId]
  );

  return { ...fetcher, download };
}

export { useDownloadBlankScoresheet };
