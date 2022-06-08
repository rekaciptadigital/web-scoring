import { useFetcher } from "utils/hooks/alt-fetcher";
import { EliminationService } from "services";

function useSubmitEliminationConfig(categoryDetailId) {
  const fetcher = useFetcher();

  const submit = async (
    countNumber,
    { onSuccess: consumerSuccessHandler, onError: consumerErrorHandler }
  ) => {
    if (!categoryDetailId) {
      return;
    }

    const putFunction = () => {
      return EliminationService.setEventEliminationV2({
        event_category_id: categoryDetailId,
        match_type: 1,
      });
    };

    fetcher.runAsync(putFunction, {
      onSuccess(data) {
        consumerSuccessHandler?.(data);
      },
      onError(errors) {
        consumerErrorHandler?.(errors);
      },
    });
  };

  return { ...fetcher, submit };
}

export { useSubmitEliminationConfig };
