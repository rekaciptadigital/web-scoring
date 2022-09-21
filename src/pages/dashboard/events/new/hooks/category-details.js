import * as React from "react";
import { useFetcher } from "hooks/alt-fetcher";
import { EventsService } from "services";

function useCategoryDetails(eventId) {
  const fetcher = useFetcher();

  const fetch = () => {
    const getFunction = () => {
      const qs = { event_id: eventId };
      return EventsService.getCategoryDetailV2(qs);
    };
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetch();
  }, [eventId]);

  return { ...fetcher, fetch };
}

export { useCategoryDetails };
