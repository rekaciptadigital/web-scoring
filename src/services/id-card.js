import API from "../utils/api";

export default {
  getForEditor(qs = null, abortSignal) {
    return API.get("/web/v2/id-card/template-by-event-id", qs, abortSignal);
  },
  save(data = null) {
    return API.post("/web/v2/id-card/template", data, null, true);
  },
  getDownloadIdCard(qs = null) {
    return API.get("/web/v2/id-card/download-by-category", qs);
  }
};
