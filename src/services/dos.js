import API from "../utils/api";

export default {
  get(qs = null) {
    return API.get("/web/v1/dashboard-dos", qs);
  },
  getQualificationMembersV2(qs) {
    return API.get("/web/v1/dashboard-dos/scorer-qualification", qs);
  },
  getQualificationDownloadUrl(qs) {
    return API.get("/web/v1/dashboard-dos/download-score-qualification", qs);
  },
  getEventEliminationTemplate(qs) {
    return API.get("/web/v1/dashboard-dos/elimination-template", qs);
  },
  getEliminationDownloadUrl({ event_category_id }) {
    const qs = { event_category_id };
    return API.get("/web/v1/dashboard-dos/download-elimination", qs);
  },
  getDosQualification(qs) {
    return API.get("/web/v1/dashboard-dos/scorer-qualification", qs);
  }

};
