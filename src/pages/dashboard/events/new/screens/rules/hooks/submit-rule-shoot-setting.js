import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useSubmitRuleSetting(eventId, formData) {
  const fetcher = useFetcher();

  const submit = (options) => {
    const payload = _makePayload(eventId, formData);
    const postFunction = () => {
      return EventsService.storeSetConfigShootRule(payload);
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

function _makePayload(eventId, formData) {
  const mappingCategoryShootRule = (data) => {
    let category = [];
    if (data.have_special_category && data.category.length > 0) {
      data.category.map((valCategory) => {
        category.push({
          competition_category_id: valCategory.data.competitionCategoryId,
          age_category_id: valCategory.data.ageCategoryId,
          distance_id: valCategory.data.distanceId,
        });
      });
    }
    return {
      child_bow: data.child_bow,
      have_special_category: data.have_special_category,
      rambahan: data.rambahan,
      session: data.session,
      category,
    };
  };

  const defaultPayload = {
    event_id: eventId,
    active_setting: !formData.active_setting ? 0 : 1,
    shoot_rule: !formData.active_setting
      ? []
      : formData.shootRule.map(mappingCategoryShootRule),
  };

  return defaultPayload;
}

export { useSubmitRuleSetting };
