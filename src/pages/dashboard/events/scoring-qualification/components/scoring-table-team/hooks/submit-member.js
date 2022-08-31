import * as React from "react";
import { useFetcher } from "hooks/alt-fetcher";
import { ParticipantService } from "services";

function useSubmitTeamMember({ eventId, member }) {
  const fetcher = useFetcher();

  const submit = React.useCallback(
    (options) => {
      fetcher.runAsync(() => {
        const payload = { event_id: eventId, member };
        return ParticipantService.setTeamMember(payload);
      }, options);
    },
    [eventId]
  );

  return { ...fetcher, submit };
}

export { useSubmitTeamMember };
