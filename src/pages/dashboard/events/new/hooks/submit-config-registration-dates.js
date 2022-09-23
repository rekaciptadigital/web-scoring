import { useFetcher } from "hooks/alt-fetcher";
import { EventsService } from "services";

import { datetime } from "utils";
import { syncTimeTo } from "../utils";

function useSubmitRegistrationDates(eventId, formData) {
  const fetcher = useFetcher();

  const submit = (options = {}) => {
    let payload = {
      event_id: eventId,
      default_datetime_start_register: formData.registrationDateStart
        ? datetime.formatServerDatetime(formData.registrationDateStart)
        : undefined,
      default_datetime_end_register: formData.registrationDateEnd
        ? datetime.formatServerDatetime(formData.registrationDateEnd)
        : undefined,
      schedule_start_event: datetime.formatServerDatetime(formData.eventDateStart),
      schedule_end_event: datetime.formatServerDatetime(formData.eventDateEnd),
      is_active_config: 0,
    };

    if (formData.isActive) {
      payload = {
        ...payload,
        is_active_config: 1,
        list_config: formData.configs?.map((config) => {
          const dateStart = datetime.formatServerDatetime(
            syncTimeTo(config.start, formData.registrationDateStart)
          );
          const dateEnd = datetime.formatServerDatetime(
            syncTimeTo(config.end, formData.registrationDateEnd)
          );

          const configPayload = {
            config_type: config.team?.value,
            date_time_start_register_config: dateStart,
            date_time_end_register_config: dateEnd,
          };

          if (!config.isSpecialActive) {
            return {
              ...configPayload,
              is_have_special_category: 0,
            };
          }

          return {
            ...configPayload,
            is_have_special_category: 1,
            special_category: _makePayloadConfigCategories(config.categories, {
              start: formData.registrationDateStart,
              end: formData.registrationDateEnd,
            }),
          };
        }),
      };
    }

    const postFunction = () => EventsService.setConfigCategoryRegister(payload);
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

/* ======================== */
// utils

function _makePayloadConfigCategories(categories, refDate) {
  const payload = categories?.map((item) => {
    const payloadCategories = [];
    for (const pair of item.categories) {
      for (const category of pair.categories) {
        payloadCategories.push({
          category_id: category.id,
        });
      }
    }

    const start = datetime.formatServerDatetime(syncTimeTo(item.start, refDate.start));
    const end = datetime.formatServerDatetime(syncTimeTo(item.end, refDate.end));

    return {
      date_time_start_register_special_category: start,
      date_time_end_register_special_category: end,
      list_category: payloadCategories,
    };
  });

  return payload || [];
}

export { useSubmitRegistrationDates };
