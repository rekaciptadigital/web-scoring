import API from "../utils/api";

export default {
  getListFaq(qs = null) {
    return API.get("/general/v2/q-and-a/get-by-event_id", qs);
  },
  creteFaq(data = null, qs = null) {
    return API.post("/web/v2/q-and-a/", data, qs);
  },
  deleteFaq(data = null, qs = null) {
    return API.deleteWithJSON("/web/v2/q-and-a/", data, qs);
  },
  getDetailFaq(qs = null) {
    return API.get("/web/v2/q-and-a/detail", qs);
  },
  updateFaq(data = null, qs = null) {
    return API.put("/web/v2/q-and-a/", data, qs, true);
  },
};
