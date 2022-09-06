import API from "../utils/api";

export default {
  findParticipantScoreDetail(qs) {
    return API.get("/web/v1/archery/scorer/participant/detail", qs);
  },
  saveParticipantScore(data = null) {
    return API.post("/web/v1/archery/scorer", data, null, true);
  },
  getScoresheetDownloadUrl(qs) {
    return API.get("/web/v1/archery-score-sheet/download", qs);
  },

  /**
   * @param {Object} qs { event_category_id, session }
   * @returns {Promise} { success, data, errors, message }
   */
  getScoresheetSelectionDownloadUrl(qs) {
    return API.get("/web/v1/archery-score-sheet/download-qualification-selection", qs);
  },

  /**
   * @param {Object} queryString { event_elimination_id, category_id, round, match }
   * @returns {Promise} { success, data, errors, message }
   */
  getScoresheetEliminationDownloadUrl(qs) {
    return API.get("/web/v1/archery-score-sheet/score-sheet-elimination", qs);
  },

  /**
   * @param {Object} queryString  { elimination_id, category_id, round, match }
   * @returns {Promise} { success, data, errors, message }
   */
  cancelScoringWinner(data = null) {
    return API.post("/web/v1/archery/scorer/cancel-scoring-eliminasi", data, null, true);
  },

  // V2

  /**
   * @param {Object} queryString { event_category_id, name?, elimination_template?, score_type? }
   * @returns {Promise} { success, data, errors, message }
   */
  getQualificationScoringMembersV2(qs) {
    return API.get("/web/v2/scorer-qualification", qs);
  },

  /**
   *
   * @param {Object} queryString { event_id, participant_id, is_present }
   * @returns {Promise} { success, data, errors, message }
   */
  putParticipantPresence(queryString = null) {
    return API.put("/web/v2/participant/change-is-present", null, queryString);
  },

  /**
   *
   * @param {Object} queryString  { category_id, elimination_id, round, match, budrest_number }
   * @returns {Promise} { success, data, errors, message }
   */
  saveBudrestElimination(data = null) {
    return API.post("/web/v2/event-elimination/set-budrest", data, null, true);
  },

  /**
   *
   * @param {Object} queryString  { category_id, elimination_id, round, match, member_id, admin_total }
   * @returns {Promise} { success, data, errors, message }
   */
  saveScoreAdminTotal(data = null) {
    return API.post("/web/v2/scorer-elimination/set-admin-total", data, null, true);
  },

  /**
   *
   * @param {Object} queryString  { elimination_id, category_id, round, match }
   * @returns {Promise} { success, data, errors, message }
   */
  saveScorePermanent(data = null) {
    return API.post("/web/v2/scorer-elimination/set-save-permanent", data, null, true);
  },
};
