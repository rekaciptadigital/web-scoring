import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useSubmitPublish(eventDetail) {
  const fetcher = useFetcher();

  const sendPublish = async (setStatus, { onSuccess: consumerSuccessHandler }) => {
    const postFunction = () => {
      return EventsService.setPublished({ status: setStatus }, { id: eventDetail?.id });
    };

    fetcher.runAsync(postFunction, {
      onSuccess: (data) => {
        consumerSuccessHandler?.(data);
      },
    });
  };

  return { ...fetcher, sendPublish };
}

export { useSubmitPublish };
