import API from "../utils/api";

export default {
  getByEventId({ event_id }) {
    const qs = { event_id };
    return API.get("/web/v1/archery/bud-rest", qs);
  },
  setByEventId(data = null, { event_id }) {
    const qs = { event_id };
    return API.post("/web/v1/archery/bud-rest", data, qs, true);
  },
};
