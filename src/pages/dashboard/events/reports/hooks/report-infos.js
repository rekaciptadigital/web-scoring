import * as React from "react";
import { useParams } from "react-router-dom";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useReportInfos() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const fetcher = useFetcher();
  const retryCountRemaining = React.useRef(5);
  const [isRetryEnabled, setRetryEnabled] = React.useState(true);

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

  React.useEffect(() => {
    if (!fetcher.isError && !isRetryEnabled && !retryCountRemaining.current) {
      retryCountRemaining.current = 5;
      setRetryEnabled(true);
    }
  }, [fetcher.isError, isRetryEnabled]);

  // Retry fetch info ketika gagal
  React.useEffect(() => {
    if (!fetcher.isError || !(isRetryEnabled && fetcher.isError)) {
      return;
    }

    const retryTimer = setInterval(() => {
      if (!retryCountRemaining.current) {
        setRetryEnabled(false);
        clearInterval(retryTimer);
        return;
      }
      fetchInfos();
      retryCountRemaining.current = retryCountRemaining.current - 1;
    }, 3000);

    return () => {
      clearInterval(retryTimer);
    };
  }, [fetcher.isError, isRetryEnabled]);

  return { ...fetcher, fetchInfos, isRetryEnabled };
}

export { useReportInfos };
