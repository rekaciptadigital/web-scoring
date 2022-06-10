import API from "../utils/api";

export default {
  get(qs = null) {
    return API.get("/web/v1/dashboard-dos", qs);
  },
  getQualificationMembersV2({ event_category_id, name = "", elimination_template }) {
    const queryString = { event_category_id, name: name || undefined, elimination_template };
    return API.get("/api/v1/archery/scorer/qualificaiton", queryString);
  },
  getQualificationDownloadUrl({ event_category_id }) {
    const qs = { event_category_id };
    return API.get("/web/v1/dashboard-dos/download-score-qualification", qs);
  },
  getEventEliminationTemplate(qs) {
    return API.get("/web/v1/dashboard-dos/elimination-template", qs);
  },
  getEliminationDownloadUrl({ event_category_id }) {
    const qs = { event_category_id };
    return API.get("/web/v1/dashboard-dos/download-elimination", qs);
  },

};
