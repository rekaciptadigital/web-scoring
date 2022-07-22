import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

import { datetime } from "utils";

function useSubmitSchedules(eventId) {
  const fetcher = useFetcher();

  const submitSchedules = (formData, options) => {
    const payload = _makePayload(eventId, formData);
    const postFunction = () => EventsService.storeQualificationTimeV2(payload);
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submitSchedules };
}

function _makePayload(eventId, formData) {
  const qualificationTime = formData.map((schedule) => ({
    qualification_time_id: schedule.idQualificationTime, // kalau create, `undefined`
    category_detail_id: schedule.categoryDetail?.value,
    event_start_datetime: _setScheduleDateFromInput(schedule.eventStartDatetime),
    event_end_datetime: _setScheduleDateFromInput(schedule.eventEndDatetime),
  }));

  return {
    event_id: eventId,
    qualification_time: qualificationTime,
  };
}

function _setScheduleDateFromInput(inputDate) {
  const date = datetime.formatServerDate(inputDate);
  return `${date} 00:00:00`;
}

export { useSubmitSchedules };
