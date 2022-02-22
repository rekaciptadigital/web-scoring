import { useFetcher } from "./alt-fetcher";
import { EliminationService } from "services";

function useMatchTemplate({ event_category_id, elimination_member_count }) {
  const fetcher = useFetcher();

  const queryStrings = { match_type: 1, event_category_id, elimination_member_count };
  const getTemplate = () => EliminationService.getEventEliminationTemplate(queryStrings);

  const fetchMatchTemplate = (options) => fetcher.runAsync(getTemplate, options);

  return { ...fetcher, fetchMatchTemplate };
}

export { useMatchTemplate };
