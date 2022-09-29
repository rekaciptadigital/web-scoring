import { useFetcher } from "hooks/alt-fetcher";
import { EventsService } from "services";

function useSubmitExtraInfo(eventId) {
  const fetcherAdd = useFetcher();
  const fetcherUpdate = useFetcher();
  const fetcherRemove = useFetcher();

  const submitAdd = (formItem, options = {}) => {
    if (!eventId) {
      return;
    }

    const payload = {
      event_id: eventId,
      title: formItem.title,
      description: formItem.description,
    };
    const postFunction = () => EventsService.storeMoreInfos(payload, { id: eventId });
    fetcherAdd.runAsync(postFunction, options);
  };

  const submitUpdate = (formItem, options = {}) => {
    if (!eventId) {
      return;
    }

    const payload = {
      event_id: eventId,
      title: formItem.title,
      description: formItem.description,
    };
    const postFunction = () => EventsService.updateMoreInfos(payload, { id: eventId });
    fetcherAdd.runAsync(postFunction, options);
  };

  const submitRemove = (infoId, options = {}) => {
    if (!eventId) {
      return;
    }
    const postFunction = () => EventsService.deleteMoreInfos({ id: infoId });
    fetcherAdd.runAsync(postFunction, options);
  };

  return {
    add: { ...fetcherAdd, submit: submitAdd },
    update: { ...fetcherUpdate, submit: submitUpdate },
    remove: { ...fetcherRemove, submit: submitRemove },
  };
}

export { useSubmitExtraInfo };
