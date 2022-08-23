import * as React from "react";
import { useFetcher } from "hooks/alt-fetcher";
import { GeneralService } from "services";

function useClubRanksByEvent(eventId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }

    fetcher.runAsync(() => {
      return GeneralService.getClubRanksByEvent({ event_id: eventId });
    });
  }, [eventId]);

  return fetcher;
}

export { useClubRanksByEvent };
