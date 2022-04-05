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
};
