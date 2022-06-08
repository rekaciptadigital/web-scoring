import API from "../utils/api";

export default {
  get(qs = null) {
    return API.get("/web/v1/dashboard-dos", qs);
  },
  getQualificationMembersV2({ event_category_id, name = "", elimination_template }) {
    const queryString = { event_category_id, name: name || undefined, elimination_template };
    return API.get("/api/v1/archery/scorer/qualificaiton", queryString);
  },


};
