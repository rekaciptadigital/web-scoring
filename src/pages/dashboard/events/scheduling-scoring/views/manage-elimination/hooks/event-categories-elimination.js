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
  if (!data) {
    return [];
  }

  const filteredNames = [];
  const labelOptions = ["individu male", "individu female", "maleTeam", "femaleTeam", "mixTeam"];
  for (const label of labelOptions) {
    if (!data[label]) {
      continue;
    }
    filteredNames.push(label);
  }
  return filteredNames;
}

export { useCategoriesElimination };
