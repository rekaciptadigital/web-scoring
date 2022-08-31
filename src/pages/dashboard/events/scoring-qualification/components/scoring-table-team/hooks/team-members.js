import * as React from "react";
import { useFetcher } from "hooks/alt-fetcher";
import { ParticipantService } from "services";

function useTeamMembers(eventId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetcher.runAsync(() => {
      return ParticipantService.getParticipantTeamMembers({ event_id: eventId });
    });
  }, [eventId]);

  return { ...fetcher };
}

export { useTeamMembers };
