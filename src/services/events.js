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
  getEventReportInfos(qs = null) {
    return API.get("/web/v1/archery/events/report-event-list", qs);
  },
  getEventRoundupsReport(qs = null) {
    return API.get("/web/v1/archery/events/report-result", qs);
  },
  getEventUppReport(qs = null) {
    return API.get("/web/v1/archery/events/upp", qs);
  },
  getEventMedalReport(qs = null) {
    return API.get("/web/v1/archery/events/report-medal-club", qs);
  },
  getConfigCategoryRegister(qs = null) {
    return API.get("/web/v1/archery/config-category-register", qs);
  },
  setConfigCategoryRegister(data, qs = null) {
    return API.post("/web/v1/archery/config-category-register", data, qs, true);
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
  getParentClassification(qs = null) {
    return API.get("/web/v2/classification-member", qs);
  },
  getChildrenClassification(qs = null) {
    return API.get("/web/v2/classification-member/children", qs);
  },
  createParentClassification(data = null, qs = null) {
    return API.post("/web/v2/classification-member/add-admin", data, qs, true);
  },
  createChildrenClassification(data = null, qs = null) {
    return API.postFormData(
      "/web/v2/classification-member/add-children",
      data,
      qs
    );
  },
  deleteParentClassification(qs = null) {
    return API.deleteByParams(
      "/web/v2/classification-member/delete-parent",
      qs
    );
  },
  deleteChildrenClassification(qs = null) {
    return API.delete("/web/v2/classification-member/delete-children", qs);
  },
  updateParentClassification(data = null, qs = null) {
    return API.put(
      "/web/v2/classification-member/update-parent",
      data,
      qs,
      true
    );
  },
  updateChildrenClassification(data = null, qs = null) {
    return API.put("/web/v2/classification-member/update-children", data, qs);
  },

  /**
   * @param {QueryString} qs { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getClubRankingSetting(qs = null) {
    return API.get("/web/v1/event-club-ranked/get-config", qs);
  },

  /**
   * @param {Data} data {
   *   event_id,
   *   rating_flag,
   *   rules_rating_club,
   *   categories[]: { competition_category_id, age_category_id, distance_id }
   * }
   * @returns {Promise} { success, data, errors, message }
   */
  setClubRankingSetting(data) {
    return API.post("/web/v1/event-club-ranked/set-config", data, null, true);
  },

  /**
   * @param {Data} data { logo }
   * @param {QueryString} data { event_id }
   * @returns {Promise} { success, data, errors, message }
   */
  addLogo(data, qs) {
    return API.post("/web/v1/archery/events/add-logo-event", data, qs, true);
  },

  /**
   * v2
   */
  storeEventDetailV2(data) {
    return API.post("/web/v2/events", data, null, true);
  },
  updateEventDetailV2(data = null, qs = null) {
    return API.put("/web/v2/events", data, qs, true);
  },
  storeCategoryDetailV2(data) {
    return API.post("/web/v2/category/", data, null, true);
  },
  deleteCategoryDetailV2(data) {
    return API.deleteWithJSON("/web/v2/category/", data);
  },
  storeQualificationTimeV2(data) {
    // create/update
    return API.post("/web/v2/qualification-time", data, null, true);
  },

  /**
   * General
   */
  getCategoryDetailV2(qs = null) {
    return API.get("/general/v2/category-details", qs);
  },

  /**
   * ID Card
   */
  getDownloadIdCard({
    event_id,
    type,
    team_category_id,
    age_category_id,
    competition_category_id,
    distance_id,
  }) {
    const qs = {
      event_id,
      type,
      team_category_id,
      age_category_id,
      competition_category_id,
      distance_id,
    };
    return API.get("/web/v2/id-card/download-by-category", qs);
  },

  deleteEvent(qs) {
    return API.deleteByParams("/web/v1/archery/events/delete-event", qs);
  },

  getShootRuleSetting(qs = null) {
    return API.get(
      "/web/v1/aturan-pertandingan/get-config-aturan-pertandingan",
      qs
    );
  },

  storeSetConfigShootRule(data) {
    return API.post(
      "/web/v1/aturan-pertandingan/set-config-aturan-pertandingan",
      data,
      null,
      true
    );
  },

  getTargetFaceSetting(qs = null) {
    return API.get("/web/v1/config-target-face/get-config-target-face", qs);
  },

  storeSetConfigFaceRule(data) {
    return API.post(
      "/web/v1/config-target-face/set-config-target-face",
      data,
      null,
      true
    );
  },
};
