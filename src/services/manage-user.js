import API from "../utils/api";

export default {
  listAdmin(qs = null) {
    return API.get("/web/v1/management-user/get-list-admin", qs);
  },

  cekEmail(qs = null) {
    return API.get("/web/v1/management-user/check-is-exists-admin", qs);
  },

  listRole() {
    return API.get("/web/v1/management-user/get-list-role");
  },

  detailData(qs = null) {
    return API.get("/web/v1/management-user/get-detail-admin", qs);
  },

  inviteAdmin($data = null, qs = null) {
    return API.post("/web/v1/management-user/create-new-user", $data, qs, true);
  },

  removeAdmin($data = null, qs = null) {
    return API.post("/web/v1/management-user/remove-access-admin", $data, qs, true);
  },
};
