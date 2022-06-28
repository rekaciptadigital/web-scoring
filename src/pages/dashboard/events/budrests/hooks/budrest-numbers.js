import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { BudRestService } from "services";

function useBudrestNumbers(eventId, categoryId) {
  const fetcher = useFetcher();

  const fetchBudrestNumbers = () => {
    const getFunction = () => {
      return BudRestService.getNumbersByEventId({ event_id: eventId, category_id: categoryId });
    };
    fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetchBudrestNumbers();
  }, [eventId]);

  return { ...fetcher, fetchBudrestNumbers };
}

export { useBudrestNumbers };
