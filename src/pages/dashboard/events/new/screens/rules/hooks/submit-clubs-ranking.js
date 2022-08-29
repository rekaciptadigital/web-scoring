import { useFetcher } from "utils/hooks/alt-fetcher";
import { EventsService } from "services";

function useSubmitClubsRanking(eventId, formData) {
  const fetcher = useFetcher();

  const submit = (options) => {
    const payload = _makePayload(eventId, formData);
    const postFunction = () => {
      return EventsService.setClubRankingSetting(payload);
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submit };
}

function _makePayload(eventId, formData) {
  const defaultPayload = {
    event_id: eventId,
    rating_flag: formData.type,
  };

  const makeCategoryData = (option) => ({
    competition_category_id: option.data.competitionCategoryId,
    age_category_id: option.data.ageCategoryId,
    distance_id: option.data.distanceId,
  });

  switch (formData.type) {
    case 1: {
      return { ...defaultPayload };
    }

    case 2: {
      return {
        ...defaultPayload,
        rules_rating_club: formData.medalCountingType.value,
        categories: formData.categories.map(makeCategoryData),
      };
    }

    case 3: {
      return {
        ...defaultPayload,
        group_name: formData.rankingName,
        rules_rating_club: formData.medalCountingType.value,
        categories: formData.categories.map(makeCategoryData),
      };
    }

    default: {
      return {};
    }
  }
}

export { useSubmitClubsRanking };
