import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useSubmitAdminTotal({ categoryId, eliminationId, round, match }) {
  const fetcher = useFetcher();

  const submitAdminTotal = (payload, options = {}) => {
    const postFunction = () => {
      return ScoringService.saveScoreAdminTotal({
        category_id: categoryId,
        elimination_id: eliminationId,
        round: round,
        match: match,
        member_id: payload.memberId,
        admin_total: payload.value,
      });
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submitAdminTotal };
}

export { useSubmitAdminTotal };
