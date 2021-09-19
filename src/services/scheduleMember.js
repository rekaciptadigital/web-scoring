import API from "../utils/api";

export default {
  get(qs = null) {
    return API.get("/app/v1/archery/event-qualification-schedule", qs);
  },
  set(data=null,qs = null) {
    return API.post("/app/v1/archery/event-qualification-schedule",data, qs, true);
  },
  unset(data=null,qs = null) {
    return API.post("/app/v1/archery/event-qualification-schedule/unset",data, qs, true);
  }
};
