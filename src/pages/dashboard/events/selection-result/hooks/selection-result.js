import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useSelectionResult(categoryDetailId) {
  const fetcher = useFetcher();

  const { sessionNumbersList, sessionEliminationNumbersList } = useSessionsLists(fetcher.data);

  React.useEffect(() => {
    if (!categoryDetailId) {
      return;
    }
    const getFunction = () => {
      const qs = { event_category_id: categoryDetailId };
      return ScoringService.getSelectionResult(qs);
    };
    fetcher.runAsync(getFunction);
  }, [categoryDetailId]);

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

    lists.sessionNumbersList = Object.keys(data[0].qualification.sessions)
      .map((key) => parseInt(key))
      .filter((sessionNumber) => sessionNumber !== 11);

    lists.sessionEliminationNumbersList = Object.keys(data[0].elimination.sessions)
      .map((key) => parseInt(key))
      .filter((sessionNumber) => sessionNumber !== 11);

    return lists;
  }, [data]);

  return numbersData;
}

export { useSelectionResult };
