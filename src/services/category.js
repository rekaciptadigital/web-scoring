import API from "utils/api";

export default {
  get(qs = null) {
    return API.get("/web/v1/archery/event-by-slug", qs);
  },
  getMasterAgeCategories(qs = null) {
    return API.get("/web/v1/archery/age-categories/get-by-eo", qs);
  },

  /**
   * @param {Object} data
   * @returns {Promise} { success, data, errors, message }
   */
  createMasterAgeCategory(data, queryString = null) {
    return API.post("/web/v1/archery/age-categories/create-by-eo", data, queryString, true);
  },
};
