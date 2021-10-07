import API from "../utils/api";

export default {
  profile(qs = null) {
    return API.get("/web/v1/user", qs);
  },
};
