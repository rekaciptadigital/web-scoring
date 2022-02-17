import API from "../utils/api";

export default {
  findParticipantScoreDetail({ code }) {
    const qs = { code };
    return API.get("/web/v1/archery/scorer/participant/detail", qs);
  },
  saveParticipantScore(data = null) {
    return API.post("/web/v1/archery/scorer", data, null, true);
  },
};
