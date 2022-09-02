import * as React from "react";
import { useFetcher } from "hooks/alt-fetcher";
import { ParticipantService } from "services";

function useTeamMembers({ categoryId, participantId }) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!categoryId || !participantId) {
      return;
    }
    fetcher.runAsync(() => {
      return ParticipantService.getParticipantTeamMembers({
        category_detail_group_id: categoryId,
        participant_id: participantId,
      });
    });
  }, [categoryId, participantId]);

  return { ...fetcher };
}

export { useTeamMembers };
