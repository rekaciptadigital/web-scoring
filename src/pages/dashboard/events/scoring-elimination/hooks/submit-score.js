// import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useSubmitScore() {
  const fetcher = useFetcher();

  const submitScore = async (payload, { onSuccess, onError }) => {
    const postFunction = () => {
      return ScoringService.saveParticipantScore({
        ...payload,
        // paksa save permanent
        save_permanent: 1,
      });
    };

    fetcher.runAsync(postFunction, { onSuccess, onError });
  };

  return { ...fetcher, submitScore };
}

export { useSubmitScore };
