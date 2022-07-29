import { useArcheryCategories } from "./abstract-archery-categories";
import { EventsService, CategoryService } from "services";

function useCompetitionCategories() {
  return useArcheryCategories(EventsService.getEventCompetitionCategories);
}

function useAgeCategories() {
  // List kategori yang muncul di opsi adalah semua kategori default ditambah
  // yang dibuat oleh user admin itu sendiri
  return useArcheryCategories(CategoryService.getMasterAgeCategories);
}

function useDistanceCategories() {
  return useArcheryCategories(EventsService.getEventDistanceCategories);
}

export { useCompetitionCategories, useAgeCategories, useDistanceCategories };
