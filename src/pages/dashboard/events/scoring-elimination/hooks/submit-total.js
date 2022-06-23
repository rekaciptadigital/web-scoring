import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useSubmitAdminTotal({ categoryId, participantId, memberId, eliminationId, round, match }) {
  const fetcher = useFetcher();

  const submitAdminTotal = (value, options = {}) => {
    const postFunction = () => {
      return ScoringService.saveScoreAdminTotal({
        category_id: categoryId,
        elimination_id: eliminationId,
        participant_id: participantId,
        member_id: memberId,
        round: round,
        match: match,
        admin_total: value,
      });
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submitAdminTotal };
}

export { useSubmitAdminTotal };
