import API from "../utils/api";

export default {
  getCities(qs) {
    return API.get("/api/general/get-city", qs);
  },

  // V2

  /**
   * @param {Object} queryString { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getCategoryV2(queryString = null) {
    return API.get("/general/v2/category-details", queryString);
  },
};
