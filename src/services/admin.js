import API from "../utils/api";

export default {
  profile(qs = null) {
    return API.get("/web/v1/user", qs);
  },
  updateAvatar(data = null, qs = null) {
    return API.put("/web/v1/user/avatar", data, qs, true);
  },
};
