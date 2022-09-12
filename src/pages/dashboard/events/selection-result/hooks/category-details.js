import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { GeneralService } from "services";

function useCategoryDetails(eventId) {
  const fetcher = useFetcher();

  const fetchCategoryDetails = () => {
    const getFunction = () => {
      return GeneralService.getCategoryV2({ event_id: eventId });
    };
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetchCategoryDetails();
  }, [eventId]);

  return { ...fetcher, fetchCategoryDetails };
}

export { useCategoryDetails };
