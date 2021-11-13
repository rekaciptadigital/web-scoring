import API from "../utils/api";

export default {
  getForEditor(qs = null) {
    return API.get("/web/v1/event-certificate-templates/", qs);
  },
  create(data = null, qs = null) {
    return API.post("/web/v1/event-certificate-templates", data, qs, true);
  },
  saveUpdate(data = null, qs = null) {
    return API.put("/web/v1/event-certificate-templates/", data, qs, true);
  },
};
