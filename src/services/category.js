import API from '../utils/api'

export default {
    get(qs = null) {
        return API.get("/web/v1/archery/event-by-slug", qs)
    },
}