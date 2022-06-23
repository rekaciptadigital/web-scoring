import API from "../utils/api";

export default {
  get(qs) {
    return API.get("/web/v1/archery/official/get-all-member", qs);
  },
};