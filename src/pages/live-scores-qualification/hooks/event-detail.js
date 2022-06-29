import * as React from "react";
import { useParams } from "react-router-dom";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { GeneralService } from "services";

function useEventDetail() {
  const { event_id } = useParams();
  const eventDetail = useFetcher();
  const { data, isLoading: isFetching } = eventDetail;

  const eventId = parseInt(event_id);
  const isLoading = !data && isFetching;

  const fetchEventDetail = () => {
    const getFunction = () => GeneralService.getEventDetailByIdV2({ event_id: eventId });
    eventDetail.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetchEventDetail();
  }, [eventId]);

  return { ...eventDetail, isLoading, isFetching, fetchEventDetail };
}

export { useEventDetail };
