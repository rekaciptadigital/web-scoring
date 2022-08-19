import * as React from "react";
import { useFetcher } from "hooks/alt-fetcher";
import { GeneralService } from "services";

function useWinnersByCategory(eventId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetcher.runAsync(() => {
      return GeneralService.getCategoryWinnersByEvent({ event_id: eventId });
    });
  }, [eventId]);

  return fetcher;
}

export { useWinnersByCategory };
