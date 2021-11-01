import API from '../utils/api'

export default {
    getEventEliminationTemplate(qs) {
        return API.get("/web/v1/event-elimination/template", qs)
    },
    getEventEliminationSchedule(qs) {
        return API.get("/web/v1/event-elimination/schedule", qs)
    },
    setEventEliminationSchedule(qs) {
        return API.post("/web/v1/event-elimination/schedule", qs)
    },
    setEventElimination(qs) {
        return API.post("/web/v1/event-elimination/set", qs)
    },
    removeEventEliminationSchedule(qs) {
        return API.delete("/web/v1/event-elimination/schedule", qs)
    }
}
