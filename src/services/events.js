import API from '../utils/api'

export default {
    register(data = null, qs = null) {
        return API.post("/web/v1/archery/events", data, qs, true)
    },
    saveScore(data = null, qs = null) {
        return API.post("/web/v1/archery/scorer", data, qs, true)
    },
    get(qs = null) {
        return API.get("/web/v1/archery/events", qs)
    },
    getEventBySlug(qs) {
        return API.get("/web/v1/archery/event-by-slug", qs)
    },
    getEventById(qs) {
        return API.get("/web/v1/archery/events/"+qs.id, qs)
    },
    getEventDetailById(qs) {
        return API.get("/web/v1/archery/events/detail", qs);
    },
    getEventMember(qs) {
        return API.get("/web/v1/archery/events/participant/members", qs)
    },
    getEventMemberProfile(qs) {
        return API.get("/web/v1/archery/events/participant/member/profile", qs)
    },
    getEventMemberScoring(qs) {
        return API.get("/api/v1/archery/scorer/participant", qs)
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
    storeQualificationSchedules(data) {
        return API.post("/web/v1/archery/qualification-time", data, null, true);
    }
}
