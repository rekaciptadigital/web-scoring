import { useFetcher } from "hooks/alt-fetcher";
import { EventsService } from "services";

function useSubmitEventLogo(eventId) {
  const fetcher = useFetcher();

  const submit = (imgBase64, options = {}) => {
    const serviceFunction = () => {
      const payload = { logo: imgBase64 };
      const qs = { event_id: eventId };
      return EventsService.addLogo(payload, qs);
    };
    fetcher.runAsync(serviceFunction, options);
  };

  return { ...fetcher, submit };
}

export { useSubmitEventLogo };
