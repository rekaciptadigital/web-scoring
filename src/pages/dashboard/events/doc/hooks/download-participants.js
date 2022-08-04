import { useParams } from "react-router-dom";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

import { urlUtil } from "utils";

function useReportParticipants() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const fetcher = useFetcher();

  const downloadParticipants = ({ onSuccess, ...options }) => {
    const getFunction = () => {
      return EventsService.getEventLaporan({
        event_id: eventId,
        status_id: 1,
      });
    };
    const customOptions = {
      ...options,
      onSuccess: (data) => {
        onSuccess?.(data);
        urlUtil.openUrlOnNewTab(data);
      },
    };
    fetcher.runAsync(getFunction, customOptions);
  };

  return { ...fetcher, downloadParticipants };
}

export { useReportParticipants };
