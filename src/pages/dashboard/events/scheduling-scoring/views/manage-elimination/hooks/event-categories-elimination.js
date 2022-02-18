import * as React from "react";
import { useFetcher } from "utils/hooks/fetcher";
import { EventsService } from "services";

function useCategoriesElimination(eventId) {
  const getCategoryDetails = () => EventsService.getEventCategoryRegister({ event_id: eventId });
  const options = { shouldFetch: Boolean(eventId) };
  const fetcher = useFetcher(getCategoryDetails, options);
  const groupNames = makeGroupNames(fetcher.data);

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetcher.refetch();
  }, [eventId]);

  return { ...fetcher, groupNames };
}

function makeGroupNames(data) {
  if (!data) return [];
  return Object.keys(data).sort((teamCategory) => {
    return teamCategory === "individu male" ? -1 : 0;
  });
}

export { useCategoriesElimination };
