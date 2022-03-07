import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";
import { parseISO } from "date-fns";

function useEventDetail(eventId) {
  const eventDetail = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }

    eventDetail.runAsync(
      () => {
        return EventsService.getEventDetailById({ id: eventId });
      },
      { transform }
    );
  }, []);

  return eventDetail;
}

function transform(data) {
  const eventEnd = data.publicInformation.eventEnd;
  data.publicInformation.eventEnd = parseISO(eventEnd);
  return data;
}

export { useEventDetail };
