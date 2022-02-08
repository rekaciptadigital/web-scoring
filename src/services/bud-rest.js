import API from "../utils/api";

export default {
  getByEventId({ event_id }) {
    const qs = { event_id };
    return API.get("/web/v1/archery/bud-rest", qs);
  },
};
