import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useSubmitCancelWinner({ eliminationId, categoryId, round, match }) {
  const fetcher = useFetcher();

  const submitCancelWinner = (options) => {
    const postFunction = () => {
      return ScoringService.cancelScoringWinner({
        category_id: categoryId,
        elimination_id: eliminationId,
        round: round,
        match: match,
      });
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submitCancelWinner };
}

export { useSubmitCancelWinner };
