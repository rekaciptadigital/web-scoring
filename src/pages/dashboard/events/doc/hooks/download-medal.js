import { useParams } from "react-router-dom";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

import { urlUtil } from "utils";

function useReportMedal() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const fetcher = useFetcher();

  const downloadMedal = ({ onSuccess, ...options }) => {
    const getFunction = () => {
      return EventsService.getEventMedalReport({ event_id: eventId });
    };
    const customOptions = {
      ...options,
      onSuccess: (data) => {
        onSuccess?.(data);
        urlUtil.openUrlOnNewTab(data.filePath);
      },
    };
    fetcher.runAsync(getFunction, customOptions);
  };

  return { ...fetcher, downloadMedal };
}

export { useReportMedal };
