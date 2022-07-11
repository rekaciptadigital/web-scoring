import API from "../utils/api";

export default {
  getProvinces(qs = null) {
    const queryString = {
      limit: qs?.limit || 50,
      page: qs?.page || 1,
    };
    return API.get("/api/general/get-province", queryString);
  },
  getCities(qs) {
    return API.get("/api/general/get-city", qs);
  },

  // V2
  /**
   * @param {Object} queryString { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getEventDetailByIdV2(queryString = null) {
    return API.get("/general/v2/events/by-id", queryString);
  },

  /**
   * @param {Object} queryString { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getCategoryV2(queryString = null) {
    return API.get("/general/v2/category-details", queryString);
  },
  getCategoryNonAuth(querString = null) {
    return API.get("/web/v1/dashboard-dos/category-details", querString);
  },
};
