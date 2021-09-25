import API from "../utils/api";

export default {
  get(qs = null) {
    return API.get("/app/v1/archery/event-qualification-schedule", qs);
  },
  getEventSchedule(qs = null) {
    return API.get("/web/v1/event-qualification-schedule", qs);
  },
  getEventMemberSchedule(qs = null) {
    return API.get("/web/v1/event-qualification-schedule/member", qs);
  },
  set(data=null,qs = null) {
    return API.post("/app/v1/archery/event-qualification-schedule",data, qs, true);
  },
  unset(data=null,qs = null) {
    return API.post("/app/v1/archery/event-qualification-schedule/unset",data, qs, true);
  }
};
