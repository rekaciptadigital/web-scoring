import * as React from "react";
import { useParams } from "react-router-dom";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useReportInfos() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const fetcher = useFetcher();

  const fetchInfos = () => {
    const getFunction = async () => {
      return EventsService.getEventReportInfos({ event_id: eventId });
    };
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetchInfos();
  }, [eventId]);

  return { ...fetcher, fetchInfos };
}

export { useReportInfos };
