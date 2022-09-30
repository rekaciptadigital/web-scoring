import * as React from "react";
import { useFetcher } from "hooks/alt-fetcher";
import { EventsService } from "services";

function useConfigRegistrationDates(eventId) {
  const fetcher = useFetcher();

  const fetch = () => {
    const getFunction = () => {
      const qs = { event_id: eventId };
      return EventsService.getConfigCategoryRegister(qs);
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

export { useConfigRegistrationDates };
