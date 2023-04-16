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
  // const defaultPayload = {
  //   event_id: eventId,
  //   active_setting: formData.activeSetting,
  //   implement_all: formData.implementAll,
  // };

  // const makeCategoryData = (option) => ({
  //   competition_category_id: option.data.competitionCategoryId,
  //   age_category_id: option.data.ageCategoryId,
  //   distance_id: option.data.distanceId,
  // });

  // const makeShootRule = (option) => ({
  //   session: option.session,
  //   rambahan: option.rambahan,
  //   child_bow: option.child_bow,
  //   category: option.category.map(makeCategoryData),
  // });

  // switch (formData.implementAll) {
  //   case 0: {
  //     return {
  //       ...defaultPayload,
  //       shoot_rule: formData.shootRule.map(makeShootRule),
  //     };
  //   }

  //   case 1: {
  //     return {
  //       ...defaultPayload,
  //       session: formData.shootRule[0].session,
  //       rambahan: formData.shootRule[0].rambahan,
  //       child_bow: formData.shootRule[0].child_bow,
  //     };
  //   }
  // }

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
