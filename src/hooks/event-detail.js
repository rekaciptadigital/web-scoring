import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useEventDetail(eventId) {
  const fetcher = useFetcher();

  const fetchEventDetail = () => {
    const getFunction = () => EventsService.getEventDetailById({ id: eventId });
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetchEventDetail();
  }, [eventId]);

  return { ...fetcher, fetchEventDetail };
}

export { useEventDetail };
