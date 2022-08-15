import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { GeneralService } from "services";

function useEventDetail(eventId) {
  const eventDetail = useFetcher();
  const { data, isLoading } = eventDetail;

  const isPreparing = !data && isLoading;

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

  return { ...eventDetail, isPreparing, fetchEventDetail };
}

export { useEventDetail };
