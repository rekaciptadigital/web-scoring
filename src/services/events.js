import API from "../utils/api";

export default {
  register(data = null, qs = null) {
    return API.post("/web/v1/archery/events", data, qs, true);
  },
  saveScore(data = null, qs = null) {
    return API.post("/web/v1/archery/scorer", data, qs, true);
  },
  get(qs = null) {
    return API.get("/web/v1/archery/events", qs);
  },
  getEventBySlug(qs) {
    return API.get("/web/v1/archery/event-by-slug", qs);
  },
  getEventById(qs) {
    return API.get("/web/v1/archery/events/detail", qs);
  },
  getEventDetailById(qs) {
    return API.get("/web/v1/archery/events/detail", qs);
  },
  getEventMember(qs) {
    return API.get("/web/v1/archery/events/participant/members", qs);
  },
  getEventMemberProfile(qs) {
    return API.get("/web/v1/archery/events/participant/member/profile", qs);
  },
  getEventMemberScoring(qs) {
    return API.get("/api/v1/archery/scorer/participant", qs);
  },
  getEventMemberIdCardByCategory({ event_id, event_category_id }) {
    const qs = { event_id, event_category_id };
    return API.get("/web/v1/archery/events/bulk-download-card", qs);
  },
  getEventCompetitionCategories(qs = null) {
    return API.get("/web/v1/archery/competition-categories", qs);
  },
  getEventAgeCategories(qs = null) {
    return API.get("/web/v1/archery/age-categories", qs);
  },
  getEventDistanceCategories(qs = null) {
    return API.get("/web/v1/archery/distance-categories", qs);
  },
  getEventTeamCategories(qs = null) {
    return API.get("/web/v1/archery/team-categories", qs);
  },
  getEventCategoryDetails(qs = null) {
    return API.get("/web/v1/archery/category-details", qs);
  },
  getEventQualificationSchedules(qs = null) {
    return API.get("/web/v1/archery/qualification-time", qs);
  },
  getEventCategoryRegister({ event_id }) {
    const qs = { event_id };
    return API.get("/web/v1/archery/events/register/list-categories", qs);
  },
  storeQualificationSchedules(data) {
    return API.post("/web/v1/archery/qualification-time", data, null, true);
  },
  updateCategoryFee(data = null, qs = null) {
    return API.put("/web/v1/archery/events/category-fee", data, qs, true);
  },
  updateEvent(data = null, qs = null) {
    return API.put("/web/v1/archery/events", data, qs, true);
  },
  storeCategoryDetails(data) {
    return API.post("/web/v1/archery/category-details", data, null, true);
  },
  updateCategoryDetails(data = null, qs = null) {
    return API.put("/web/v1/archery/category-details", data, qs, true);
  },
  deleteCategoryDetails(qs) {
    return API.deleteByParams("/web/v1/archery/category-details", qs);
  },
  storeMoreInfos(data, qs = null) {
    return API.post("/web/v1/archery/more-information", data, qs, true);
  },
  updateMoreInfos(data = null, qs = null) {
    return API.put("/web/v1/archery/more-information", data, qs, true);
  },
  deleteMoreInfos(qs) {
    return API.deleteByParams("/web/v1/archery/more-information", qs);
  },
  setPublished(data, qs = null) {
    return API.post("/web/v1/archery/events/update-status", data, qs, true);
  },
  getEventLaporan(qs = null) {
    return API.get("/web/v1/archery/events/participant/excel/download", qs);
  },
  getEventMemberNew(qs = null) {
    return API.get("/web/v2/members", qs);
  },
  getAccessCategories(qs = null) {
    return API.get("/web/v2/members/access-categories", qs);
  },
  updateCategory(data = null, qs = null) {
    return API.put("/web/v1/participant/update-category", data, qs);
  },
  getEventMemberTeam(qs = null) {
    return API.get("/web/v2/members/team", qs);
    },
}
