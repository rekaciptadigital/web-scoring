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
        const downloadURL = _handleURLFromResponse(data);
        onSuccess?.(data);
        urlUtil.openUrlOnNewTab(downloadURL);
      },
    };
    fetcher.runAsync(getFunction, customOptions);
  };

  return { ...fetcher, downloadParticipants };
}

// utils
function _handleURLFromResponse(url) {
  const API_URL = process.env.REACT_APP_API_URL || "https://api-staging.myarchery.id";
  const segments = url.split("/").filter((segment) => Boolean(segment));

  if (API_URL === process.env.REACT_APP_API_URL) {
    return segments.join("/");
  }

  const downloadUrl = API_URL + "/" + segments.join("/");
  return downloadUrl;
}

export { useReportParticipants };
