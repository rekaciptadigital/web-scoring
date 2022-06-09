import { useFetcher } from "utils/hooks/alt-fetcher";
import { ScoringService } from "services";

function useParticipantPresence() {
  const fetcher = useFetcher();

  const submitParticipantPresence = (
    { eventId, participantId, isPresent } = {},
    { onSuccess: consumerSuccessHandler, onError: consumerErrorHandler }
  ) => {
    const putFunction = () => {
      return ScoringService.putParticipantPresence({
        event_id: eventId,
        participant_id: participantId,
        is_present: isPresent,
      });
    };

    fetcher.runAsync(putFunction, {
      onSuccess() {
        consumerSuccessHandler?.();
      },
      onError() {
        consumerErrorHandler?.();
      },
    });
  };

  return { ...fetcher, submitParticipantPresence };
}

export { useParticipantPresence };
