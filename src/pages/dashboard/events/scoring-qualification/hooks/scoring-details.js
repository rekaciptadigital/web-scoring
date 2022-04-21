import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useScoringDetail(code) {
  const fetcher = useFetcher();

  const fetchScoringDetail = () => {
    const getFunction = () => {
      return ScoringService.findParticipantScoreDetail({ code });
    };
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!code) {
      return;
    }
    fetchScoringDetail();
  }, [code]);

  return { ...fetcher, fetchScoringDetail };
}

export { useScoringDetail };
