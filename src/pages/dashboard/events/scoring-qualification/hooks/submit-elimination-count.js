import { useFetcher } from "utils/hooks/alt-fetcher";
import { EliminationService } from "services";

function useSubmitEliminationCount(categoryDetailId) {
  const fetcher = useFetcher();

  const submit = async (
    countNumber,
    { onSuccess: consumerSuccessHandler, onError: consumerErrorHandler }
  ) => {
    if (!categoryDetailId) {
      return;
    }

    const putFunction = () => {
      return EliminationService.updateCountParticipantElimination({
        event_category_id: categoryDetailId,
        count_elimination_participant: countNumber,
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

export { useSubmitEliminationCount };
