import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useSubmitSetWinner({ eliminationId, round, match }) {
  const fetcher = useFetcher();

  const submitSetWinner = (options) => {
    const postFunction = () => {
      return ScoringService.saveScorePermanent({
        elimination_id: eliminationId,
        round: round,
        match: match,
      });
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submitSetWinner };
}

export { useSubmitSetWinner };
