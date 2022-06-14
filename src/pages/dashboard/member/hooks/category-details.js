import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { GeneralService } from "services";

function useCategoryDetails(eventId) {
  const fetcher = useFetcher();

  const fetchCategoryDetails = () => {
    const getFunction = () => {
      // return EventsService.getEventCategoryDetails({ event_id: eventId });
      return GeneralService.getCategoryNonAuth({ event_id: eventId});
    };
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetchCategoryDetails();
  }, [eventId]);

  const isSettled = fetcher.data || (!fetcher.data && fetcher.status === "error");

  return { ...fetcher, isSettled, fetchCategoryDetails };
}

export { useCategoryDetails };
