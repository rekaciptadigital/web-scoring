import API from "../utils/api";

export default {
  getByEventId({ event_id }) {
    const qs = { event_id };
    return API.get("/web/v1/archery/bud-rest", qs);
  },
  setByEventId(data = null, { event_id }) {
    const qs = { event_id };
    return API.post("/web/v1/archery/bud-rest", data, qs, true);
  },

  // v2
  /**
   *
   * @param {Object} queryString { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getSettingsByEventId(queryString = null) {
    return API.get("/web/v2/bud-rest", queryString);
  },

  /**
   *
   * @param {Object} queryString { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  postSettingsByEventId(data, queryString = null) {
    return API.post("/web/v2/bud-rest", data, queryString, true);
  },

  /**
   *
   * @param {Object} queryString { event_id, date }
   * @returns {Promise} { success, data, errors, message }
   */
  getMembersBudrestByDate(queryString = null) {
    return API.get("/web/v2/schedule-full-day", queryString);
  },

  /**
   *
   * @param {Object} queryString { event_id, category_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getNumbersByEventId(queryString = null) {
    return API.get("/web/v2/bud-rest/get-list-budrest", queryString);
  },

  /**
   *
   * @param {Object} queryString { event_id, schedule_id, bud_rest_number }
   * @returns {Promise} { success, data, errors, message }
   */
  putMemberNumbers(queryString = null) {
    return API.put("/web/v2/schedule-full-day/change_bud_rest", null, queryString);
  },

  /**
   *
   * @param {Object} queryString { event_id, date }
   * @returns {Promise} { success, data, errors, message }
   */
  getDownloadMembersBudrestByDate(queryString = null) {
    return API.get("/web/v2/schedule-full-day/download-budrest", queryString);
  },

  /**
   *
   * @param {Object} queryString { event_id, date }
   * @returns {Promise} { success, data, errors, message }
   */
  getDownloadIDCardByCategory(queryString = null) {
    return API.get("/web/v2/bud-rest/download-idcard-by-category", queryString);
  },
  
  /**
   *
   * @param {Object} queryString { event_id, date }
   * @returns {Promise} { success, data, errors, message }
   */
  getDownloadIDCardByBudrest(queryString = null) {
    return API.get("/web/v2/bud-rest/download-idcard-by-budrest", queryString);
  },

  /**
   *
   * @param {Object} queryString { event_id, date }
   * @returns {Promise} { success, data, errors, message }
   */
  getDownloadIDCardByClub(queryString = null) {
    return API.get("/web/v2/bud-rest/download-idcard-by-club", queryString);
  },
};
