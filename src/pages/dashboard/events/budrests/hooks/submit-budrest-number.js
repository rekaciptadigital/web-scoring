import { useFetcher } from "utils/hooks/alt-fetcher";
import { BudRestService } from "services";

function useSubmitBudrestNumber(eventId) {
  const fetcher = useFetcher();

  const submit = (params, { onSuccess: consumerSuccessHandler }) => {
    const putFunction = () => {
      return BudRestService.putMemberNumbers({
        event_id: eventId,
        category_id: params.categoryId,
        schedule_id: params.scheduleId,
        bud_rest_number: params.budrestNumber,
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
