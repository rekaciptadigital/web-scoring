import { useFetcher } from "utils/hooks/fetcher";
import { ScoringService } from "services";

function useScoringDetail({ code, elimination_id, match, round }) {
  const getScoringDetail = () => {
    return ScoringService.findParticipantScoreDetail({ code, elimination_id, match, round });
  };
  return useFetcher(getScoringDetail);
}

export { useScoringDetail };
