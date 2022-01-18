import API from "../utils/api";

export default {
  getCities(qs) {
    return API.get("/api/general/get-city", qs);
  },
};
