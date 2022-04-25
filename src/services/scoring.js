import API from "../utils/api";

export default {
  findParticipantScoreDetail(qs) {
    return API.get("/web/v1/archery/scorer/participant/detail", qs);
  },
  saveParticipantScore(data = null) {
    return API.post("/web/v1/archery/scorer", data, null, true);
  },
  getScoresheetDownloadUrl({ event_category_id }) {
    const qs = { event_category_id };
    return API.get("/web/v1/archery-score-sheet/download", qs);
  },

  // V2

  /**
   * @param {Object} queryString { event_category_id, name }
   * @returns {Promise} { success, data, errors, message }
   */
  getQualificationScoringMembersV2({ event_category_id, name = "" }) {
    const queryString = { event_category_id, name: name || undefined };
    return API.get("/web/v2/scorer-qualification", queryString);
  },
};
