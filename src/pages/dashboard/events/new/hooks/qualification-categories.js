import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useCategoriesQualification(eventDetail) {
  const fetcher = useFetcher();

  const fetchCategories = () => {
    const getFunction = () => {
      const qs = { event_id: eventDetail?.id, type: "Individual" };
      return EventsService.getCategoryDetailV2(qs);
    };
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!eventDetail) {
      return;
    }
    fetchCategories();
  }, [eventDetail]);

  return { ...fetcher, fetchCategories };
}

export { useCategoriesQualification };
