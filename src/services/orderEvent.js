import API from '../utils/api'

export default {
    register(data = null, qs = null) {
        return API.post("/web/v1/archery/event-order", data, qs, false)
    },
    get(qs = null) {
        return API.get("/web/v1/archery/event-order", qs)
    }
}