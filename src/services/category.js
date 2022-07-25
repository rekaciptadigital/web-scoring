import API from "utils/api";

export default {
  get(qs = null) {
    return API.get("/web/v1/archery/event-by-slug", qs);
  },
  getMasterAgeCategories(qs = null) {
    return API.get("/web/v1/archery/age-categories/get-by-eo", qs);
  },
};
