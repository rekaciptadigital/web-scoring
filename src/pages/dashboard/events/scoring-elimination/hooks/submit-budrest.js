import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useSubmitBudrest({ categoryId, eliminationId, round, match, participantId, memberId }) {
  const fetcher = useFetcher();

  const submitBudrest = (budrestNumberValue, options = {}) => {
    const postFunction = () => {
      return ScoringService.saveBudrestElimination({
        category_id: categoryId,
        elimination_id: eliminationId,
        round: round,
        match: match,
        budrest_number: budrestNumberValue,
        participant_id: participantId,
        member_id: memberId,
      });
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submitBudrest };
}

export { useSubmitBudrest };
