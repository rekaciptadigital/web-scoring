import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useSubmitBudrest({ categoryId, eliminationId, round, match }) {
  const fetcher = useFetcher();

  const submitBudrest = (budrestNumberValue, options = {}) => {
    const postFunction = () => {
      return ScoringService.saveBudrestElimination({
        category_id: categoryId,
        elimination_id: eliminationId,
        round: round,
        match: match,
        budrest_number: budrestNumberValue,
      });
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submitBudrest };
}

export { useSubmitBudrest };
