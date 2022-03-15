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
};
