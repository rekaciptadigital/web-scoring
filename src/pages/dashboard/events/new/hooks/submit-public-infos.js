import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

import { makePayloadPublicInfos } from "../utils/event-public-infos";

function useSubmitPublicInfos({ eventType, eventId, matchType }) {
  const fetcher = useFetcher();

  const submit = async (formData, { onSuccess: consumerSuccessHandler }) => {
    const payload = await makePayloadPublicInfos(formData, { eventType, eventId, matchType });
    const postFunction = () => EventsService.storeEventDetailV2(payload);
    const putFunction = () => {
      return EventsService.updateEventDetailV2(payload, { event_id: eventId });
    };

    const fetchingFunction = eventId ? putFunction : postFunction;
    fetcher.runAsync(fetchingFunction, {
      onSuccess: (data) => {
        consumerSuccessHandler?.(data);
      },
    });
  };

  return { ...fetcher, submit };
}

export { useSubmitPublicInfos };
