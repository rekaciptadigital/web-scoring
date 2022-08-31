import * as React from "react";
import { useFetcher } from "hooks/alt-fetcher";
import { ParticipantService } from "services";

function useSubmitTeamMember({ memberId, targetMemberId, participantId, categoryId }) {
  const fetcher = useFetcher();

  const submit = React.useCallback(
    (options) => {
      fetcher.runAsync(() => {
        const payload = {
          member_id_old: memberId,
          member_id_new: targetMemberId,
          participant_id: participantId,
          category_id: categoryId,
        };
        return ParticipantService.setTeamMember(payload);
      }, options);
    },
    [memberId, targetMemberId, participantId, categoryId]
  );

  return { ...fetcher, submit };
}

export { useSubmitTeamMember };
