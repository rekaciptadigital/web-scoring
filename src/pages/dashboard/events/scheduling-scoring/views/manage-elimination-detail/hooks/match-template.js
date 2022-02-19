import { useFetcher } from "utils/hooks/fetcher";
import { EliminationService } from "services";

function useMatchTemplate({ event_category_id }) {
  const getTemplate = () => EliminationService.getEventEliminationTemplate({ event_category_id });
  return useFetcher(getTemplate);
}

export { useMatchTemplate };
