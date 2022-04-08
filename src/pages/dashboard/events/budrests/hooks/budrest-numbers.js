import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { BudRestService } from "services";

function useBudrestNumbers(eventId, date) {
  const fetcher = useFetcher();

  const fetchBudrestNumbers = () => {
    const getFunction = () => BudRestService.getNumbersByEventId({ event_id: eventId, date: date });
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
