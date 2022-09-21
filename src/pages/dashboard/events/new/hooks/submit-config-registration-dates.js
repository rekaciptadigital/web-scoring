import { useFetcher } from "hooks/alt-fetcher";
import { EventsService } from "services";

import { datetime } from "utils";

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
      is_active_config: 0,
    };

    if (formData.isActive) {
      payload = {
        ...payload,
        is_active_config: 1,
        list_config: formData.configs?.map((config) => {
          const dateStart = config.start ? datetime.formatServerDatetime(config.start) : undefined;
          const dateEnd = config.end ? datetime.formatServerDatetime(config.end) : undefined;

          const configPayload = {
            config_type: config.team?.value,
            date_time_start_register_config: dateStart,
            date_time_end_register_config: dateEnd,
            is_deleted: 0, // TODO: handle kondisionalnya kalau sudah ada API get
            // config_id: ??, // TODO: handle kondisionalnya kalau sudah ada API get
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
            special_category: _makePayloadSpecialCategory(config.categories),
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

function _makePayloadSpecialCategory(categories) {
  const payload = [];
  // Deal with it, this the truth.
  // Here comes, nested loops!
  for (const item of categories) {
    for (const pair of item.categories) {
      for (const category of pair.categories) {
        const payloadItem = {
          category_id: category.id,
          date_time_start_register_special_category: item.start
            ? datetime.formatServerDatetime(item.start)
            : undefined,
          date_time_end_register_special_category: item.end
            ? datetime.formatServerDatetime(item.end)
            : undefined,
          is_deleted: 0, // TODO: handle kondisionalnya kalau sudah ada API get
        };
        payload.push(payloadItem);
      }
    }
  }
  return payload;
}

export { useSubmitRegistrationDates };
