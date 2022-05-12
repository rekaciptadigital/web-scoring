import API from "../utils/api";

export default {
  get({ event_id }) {
    const qs = { event_id };
    return API.get("/web/v1/archery/official/get-all-member", qs);
  },
};