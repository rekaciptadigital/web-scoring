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
    const data = {
      sessionNumbersList: null,
      sessionEliminationNumbersList: null,
    };

    if (!data?.length) {
      return data;
    }

    data.sessionNumbersList = Object.keys(data[0].sessions)
      .map((key) => parseInt(key))
      .filter((sessionNumber) => sessionNumber !== 11);

    data.sessionEliminationNumbersList = Object.keys(data[0].sessionsEliminationSelection)
      .map((key) => parseInt(key))
      .filter((sessionNumber) => sessionNumber !== 11);

    return data;
  }, [data]);

  return numbersData;
}

export { useSelectionResult };
