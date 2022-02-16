import { useFetcher } from "./fetcher";
import { EventQualificationService } from "services";

const { getEventCategoryDetails } = EventQualificationService;

function useCategoriesByGender(eventId) {
  const fetcher = useFetcher(() => getEventCategoryDetails({ event_id: eventId }));
  const groupNames = makeGroupNames(fetcher.data);

  return { ...fetcher, groupNames };
}

function makeGroupNames(data) {
  if (!data) return [];
  return Object.keys(data).sort((teamCategory) => {
    return teamCategory === "individu male" ? -1 : 0;
  });
}

export { useCategoriesByGender };
