import API from "../utils/api";

export default {
  getProvinces(qs = null) {
    return API.get("/api/general/get-province", qs);
  },
  getCities(qs = null) {
    return API.get("/api/general/get-city", qs);
  },
  getCountry(qs = null) {
    return API.get("/api/general/get-country", qs);
  },
  getProvinceCountry(qs = null) {
    return API.get("/api/general/get-province-country", qs);
  },
  getCitiesCountry(qs = null) {
    return API.get("/api/general/get-city-country", qs);
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

  /**
   * @param {Object} queryString { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getClubRankingCategories(queryString = null) {
    return API.get(
      "/api/general/get-list-tab-category-by-event-id",
      queryString
    );
  },

  /**
   * @param {Object} queryString { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getClubRanksByEvent(qs = null) {
    return API.get("/api/event-ranked/club", qs);
  },

  /**
   * @param {Object} queryString { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getCategoryWinnersByEvent(qs = null) {
    return API.get("/api/general/get-winer-participant-by-event-id", qs);
  },
};
