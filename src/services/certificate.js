import API from "../utils/api";

export default {
  getForEditor(qs = null, abortSignal) {
    return API.get("/web/v1/event-certificate-templates/", qs, abortSignal);
  },
  save(data = null) {
    return API.post("/web/v1/event-certificate-templates", data, null, true);
  },
};
