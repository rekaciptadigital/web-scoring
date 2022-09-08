import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useSelectionResult({ categoryDetailId, standing }) {
  const fetcher = useFetcher();

  const { sessionNumbersList, sessionEliminationNumbersList } = useSessionsLists(fetcher.data);

  React.useEffect(() => {
    if (!categoryDetailId) {
      return;
    }
    const getFunction = () => {
      const qs = {
        event_category_id: categoryDetailId,
        standings_type: standing || undefined,
      };
      return ScoringService.getSelectionResult(qs);
    };
    fetcher.runAsync(getFunction);
  }, [categoryDetailId, standing]);

  return {
    ...fetcher,
    sessionNumbersList,
    sessionEliminationNumbersList,
  };
}

function useSessionsLists(data) {
  const numbersData = React.useMemo(() => {
    const lists = {
      sessionNumbersList: null,
      sessionEliminationNumbersList: null,
    };

    if (!data?.length) {
      return lists;
    }

    const qualification = data[0].qualification?.sessions || data[0].sessions || {};
    const elimination = data[0].elimination?.sessions || data[0].sessions || {};

    lists.sessionNumbersList = Object.keys(qualification)
      .map((key) => parseInt(key))
      .filter((sessionNumber) => sessionNumber !== 11);

    lists.sessionEliminationNumbersList = Object.keys(elimination)
      .map((key) => parseInt(key))
      .filter((sessionNumber) => sessionNumber !== 11);

    return lists;
  }, [data]);

  return numbersData;
}

export { useSelectionResult };
