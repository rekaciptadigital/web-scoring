import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useSubmitRuleFaceSetting(eventId, formData) {
  const fetcher = useFetcher();

  const submit = (options) => {
    const payload = _makePayload(eventId, formData);
    const postFunction = () => {
      return EventsService.storeSetConfigFaceRule(payload);
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

function _makePayload(eventId, formData) {
  const defaultPayload = {
    event_id: eventId,
    highest_score: 10,
    score_x: 10,
    active_setting: formData.activeSetting,
    implement_all: formData.implementAll
  };

  const makeCategoryData = (option) => ({
    competition_category_id: option.data.competitionCategoryId,
    age_category_id: option.data.ageCategoryId,
    distance_id: option.data.distanceId,
  });

  const makeShootRule = (option) => ({
    highest_score: option.highest_score,
    score_x: option.score_x,
    categories: option.category.map(makeCategoryData)
  });

  switch (formData.implementAll) {
    case 0: {
      return {
        ...defaultPayload,
        categories_config: formData.categories_config.map(makeShootRule),
      };
    }

    case 1: {
      return {
        ...defaultPayload,
        highest_score: formData.categories_config[0].highest_score,
        score_x: formData.categories_config[0].score_x,
      };
    }
  }
}

export { useSubmitRuleFaceSetting };
