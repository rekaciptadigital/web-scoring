import API from "../utils/api";

export default {
  /**
   * @param {QueryString} queryString { ... }
   * @returns {Promise} { success, data, errors, message }
   */
  getParticipantTeamMembers(qs) {
    // TODO
    return API.get("", qs);
  },

  /**
   * @param {Data} data { ... }
   * @returns {Promise} { success, data, errors, message }
   */
  setTeamMember(data) {
    // TODO
    return API.post("", data, null, true);
  },
};
