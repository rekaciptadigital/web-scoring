import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useSubmitScores() {
  const fetcher = useFetcher();

  const submitScoringDetail = (payload, options = {}) => {
    const postFunction = () => {
      return ScoringService.saveParticipantScore(payload);
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submitScoringDetail };
}

export { useSubmitScores };
