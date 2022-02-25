import { useFetcher } from "./fetcher";
import { EventQualificationService } from "services";

const { getEventCategoryDetails } = EventQualificationService;

function useCategoriesByGender(eventId) {
  const fetcher = useFetcher(() => getEventCategoryDetails({ event_id: eventId }));
  const groupNames = makeGroupNames(fetcher.data);

  return { ...fetcher, groupNames };
}

function makeGroupNames(data) {
  if (!data) {
    return [];
  }

  const sortedNames = [];
  const labelOptions = ["individu male", "individu female"];
  for (const label of labelOptions) {
    if (!data[label]) {
      continue;
    }
    sortedNames.push(label);
  }
  return sortedNames;
}

export { useCategoriesByGender };
