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
    };

    if (formData.isActive) {
      payload = {
        ...payload,
        list_config: formData.configs?.map((config) => {
          const dateStart = config.registrationDateStart
            ? datetime.formatServerDatetime(config.registrationDateStart)
            : undefined;

          const dateEnd = config.registrationDateEnd
            ? datetime.formatServerDatetime(config.registrationDateEnd)
            : undefined;

          const configPayload = {
            team_category_id: config.team?.value,
            date_time_start_register: dateStart,
            date_time_end_register: dateEnd,
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

            special_category:
              config.categories?.map((category) => ({
                category_id: category?.value,
                // is_deleted: 0, // TODO:
                date_time_start_register: dateStart,
                date_time_end_register: dateEnd,
              })) || [],
          };
        }),
      };
    }

    const postFunction = () => EventsService.setConfigCategoryRegister(payload);
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

export { useSubmitRegistrationDates };
