import API from "../utils/api";

export default {
  getEventCategoryDetails({ event_id }) {
    const qs = { event_id };
    return API.get("/web/v1/archery/category-details/qualification", qs);
  },
  getParticipantScoring({ event_category_id }) {
    const qs = { event_category_id };
    return API.get("/api/v1/archery/scorer/qualificaiton", qs);
  },
};
