import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useScoringDetail(code) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!code) {
      return;
    }

    const getFunction = () => {
      return ScoringService.findParticipantScoreDetail({ code });
    };

    fetcher.runAsync(getFunction);
  }, [code]);

  return { ...fetcher };
}

export { useScoringDetail };
