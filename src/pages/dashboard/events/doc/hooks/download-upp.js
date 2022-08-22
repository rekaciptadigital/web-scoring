import { useParams } from "react-router-dom";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

import { urlUtil } from "utils";

function useReportUpp() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const fetcher = useFetcher();

  const downloadUpp = ({ onSuccess, ...options }) => {
    const getFunction = () => {
      return EventsService.getEventUppReport({ event_id: eventId });
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

  return { ...fetcher, downloadUpp };
}

export { useReportUpp };
