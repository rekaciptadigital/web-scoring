import * as React from "react";
import { useParams } from "react-router-dom";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { GeneralService } from "services";

function useCategoryDetails() {
  const fetcher = useFetcher();
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    const getFunction = () => GeneralService.getCategoryV2({ event_id: eventId });
    fetcher.runAsync(getFunction);
  }, [eventId]);

  return fetcher;
}

export { useCategoryDetails };
