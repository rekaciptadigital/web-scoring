import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { GeneralService } from "services";

function useCategoryDetails(eventId) {
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (!eventId) {
      return;
    }

    const getFunction = () => {
      return GeneralService.getCategoryV2({ event_id: eventId });
    };

    fetcher.runAsync(getFunction);
  }, [eventId]);

  return fetcher;
}

export { useCategoryDetails };
