import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { GeneralService } from "services";

function useCategoryDetails(eventId, date_event) {
  const fetcher = useFetcher();

  const fetchCategoryDetails = () => {
    const getFunction = () => {
      return GeneralService.getCategoryNonAuth({ event_id: eventId, date_event: date_event, category_dos: true });
    };
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetchCategoryDetails();
  }, [eventId, date_event]);

  const isSettled = fetcher?.data || (!fetcher?.data && fetcher?.status === "error");

  return { ...fetcher, isSettled, fetchCategoryDetails };
}

export { useCategoryDetails };
