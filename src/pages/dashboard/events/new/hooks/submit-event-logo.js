import { useFetcher } from "hooks/alt-fetcher";
import { EventsService } from "services";

function useSubmitEventLogo(eventId) {
  const fetcher = useFetcher();

  const submit = (imgBase64, customOptions = {}) => {
    const { eventId: overrideEventId, ...options } = customOptions;

    const serviceFunction = () => {
      const payload = { logo: imgBase64 };
      const qs = { event_id: overrideEventId || eventId };
      return EventsService.addLogo(payload, qs);
    };

    fetcher.runAsync(serviceFunction, options);
  };

  return { ...fetcher, submit };
}

export { useSubmitEventLogo };
