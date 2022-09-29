import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useDeleteEvent(eventID) {
  const fetcher = useFetcher();

  const deleteEvent = async ({ onSuccess: consumerSuccessHandler }) => {
    const deleteFunction = () => {
      return EventsService.deleteEvent({ event_id: eventID });
    };

    fetcher.runAsync(deleteFunction, {
      onSuccess: (data) => {
        consumerSuccessHandler?.(data);
      },
    });
  };

  return { ...fetcher, deleteEvent };
}

export { useDeleteEvent };
