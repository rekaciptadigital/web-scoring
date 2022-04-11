import { useFetcher } from "utils/hooks/alt-fetcher";
import { BudRestService } from "services";

function useSubmitBudrestNumber(eventId) {
  const fetcher = useFetcher();

  const submit = ({ scheduleId, budrestNumber }, { onSuccess: consumerSuccessHandler }) => {
    const putFunction = () => {
      return BudRestService.putMemberNumbers({
        event_id: eventId,
        schedule_id: scheduleId,
        bud_rest_number: budrestNumber,
      });
    };
    fetcher.runAsync(putFunction, {
      onSuccess: (data) => {
        consumerSuccessHandler?.(data);
      },
    });
  };

  return { ...fetcher, submit };
}

export { useSubmitBudrestNumber };
