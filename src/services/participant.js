import API from "../utils/api";

export default {
  /**
   * @param {QueryString} queryString { category_detail_group_id, participant_id }
   * @returns {Promise} { success, data, errors, message }
   */
  getParticipantTeamMembers(qs) {
    return API.get("/web/v1/event-elimination/get-member-can-join-elimination-group", qs);
  },

  /**
   * @param {Data} data { member_id_old, member_id_new, participant_id, category_id }
   * @returns {Promise} { success, data, errors, message }
   */
  setTeamMember(data) {
    const reqURL = "/web/v1/event-elimination/change-member-join-elimination-group";
    return API.post(reqURL, data, null, true);
  },
};
