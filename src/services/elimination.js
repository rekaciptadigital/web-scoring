import API from "../utils/api";

export default {
  getEventEliminationTemplate(qs) {
    return API.get("/web/v1/event-elimination/template", qs);
  },
  getEventEliminationSchedule(qs) {
    return API.get("/web/v1/event-elimination/schedule", qs);
  },
  setEventEliminationSchedule(qs) {
    return API.post("/web/v1/event-elimination/schedule", qs);
  },
  setEventElimination(qs) {
    return API.post("/web/v1/event-elimination/set", qs, null, true);
  },
  removeEventEliminationSchedule(qs) {
    return API.delete("/web/v1/event-elimination/schedule", qs);
  },

  // v2
  /**
   *
   * @param {Object} queryString { event_category_id, count_elimination_participant }
   * @returns {Promise} { success, data, errors, message }
   */
  updateCountParticipantElimination(qs) {
    return API.put("/web/v2/event-elimination/set-count-participant-elimination", null, qs);
  },
  setEventEliminationV2(qs) {
    return API.post("/web/v2/event-elimination/set", qs, null, true);
  },

  /**
   * @param {Object} queryString { category_id }
   * @returns {Promise} { success, data, errors, message }
   */
  cancelTemplateScoring(qs) {
    return API.post("/web/v2/event-elimination/clean-elimination-scoring", qs, null, true);
  },
};
