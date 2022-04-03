import { useArcheryCategories } from "utils/hooks/archery-categories";
import { EventsService } from "services";

function useCompetitionCategories() {
  return useArcheryCategories(EventsService.getEventCompetitionCategories);
}

function useAgeCategories() {
  return useArcheryCategories(EventsService.getEventAgeCategories);
}

function useDistanceCategories() {
  return useArcheryCategories(EventsService.getEventDistanceCategories);
}

export { useCompetitionCategories, useAgeCategories, useDistanceCategories };
