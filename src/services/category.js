import API from "utils/api";

export default {
  get(qs = null) {
    return API.get("/web/v1/archery/event-by-slug", qs);
  },

  getMasterAgeCategories(qs = null) {
    return API.get("/web/v1/archery/age-categories/get-by-eo", qs);
  },

  /**
   * @param {int} age_category_id
   * @param {Object} params {}
   * @returns {Promise} { success, data, errors, message }
   */
  getMasterAgeCategoryById(age_category_id, qs = null) {
    const queryString = qs ? { ...qs, age_category_id } : { age_category_id };
    return API.get("/web/v1/archery/age-categories/get-detail-by-eo", queryString);
  },

  /**
   * @param {Object} data
   * @returns {Promise} { success, data, errors, message }
   */
  createMasterAgeCategory(data, queryString = null) {
    return API.post("/web/v1/archery/age-categories/create-by-eo", data, queryString, true);
  },

  /**
   * @param {Object} data
   * @returns {Promise} { success, data, errors, message }
   */
  updateMasterAgeCategory(data, queryString = null) {
    return API.put("/web/v1/archery/age-categories/update-by-eo", data, queryString, true);
  },
};
