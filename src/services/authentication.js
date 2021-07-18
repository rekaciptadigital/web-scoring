import API from "../utils/api"

export default {
  login(data = null) {
    return API.post("/api/v1/auth/login", data)
  },
  logout(data = null, qs = null) {
    return API.post("/api/v1/user/login", data, qs)
  },
  register(data = null, qs = null) {
    return API.post("/api/v1/auth/register", data, qs)
  },
  forgotPassword(data = null, qs = null) {
    return API.put("/api/v1/auth/forgot-password", data, qs)
  },
  resetPassword(data = null, qs = null) {
    return API.put("/api/v1/auth/reset-password", data, qs)
  },
}
