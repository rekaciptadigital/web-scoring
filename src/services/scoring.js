import API from "../utils/api";

export default {
  findParticipantScoreDetail(qs) {
    return API.get("/web/v1/archery/scorer/participant/detail", qs);
  },
};
