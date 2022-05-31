import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useScoringDetail({ code, elimination_id, match, round }) {
  const fetcher = useFetcher();

  const fetchScoringDetail = () => {
    const getFunction = () => {
      return ScoringService.findParticipantScoreDetail({ code: code });
    };
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!code || !elimination_id || !match || !round) {
      return;
    }
    fetchScoringDetail();
  }, [code, elimination_id, match, round]);

  return { ...fetcher, fetchScoringDetail };
}

export { useScoringDetail };
