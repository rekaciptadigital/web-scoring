import queryString from "query-string";
import fetch from "./fetch";
import { store } from "../../store";

export default {
  get(endpoint, qs = null) {
    const token = store.getState()?.authentication?.user?.accessToken;
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }
    let config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": localStorage.getItem("I18N_LANGUAGE") || "en",
      },
    };
    return fetch(`${endpoint}?${params}`, config);
  },

  post(endpoint, data = null, qs = null) {
    const token = store.getState()?.authentication?.user?.accessToken;
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }

    var formData = new FormData();

    if (Array.isArray(data) && data.length > 0) {
      data.map(item => {
        for (var key in item) {
          formData.append(key, item[key]);
        }
      });
    } else {
      for (var key in data) {
        formData.append(key, data[key]);
      }
    }
    let config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": localStorage.getItem("I18N_LANGUAGE") || "en",
      },
      body: formData,
    };
    return fetch(`${endpoint}?${params}`, config);
  },

  put(endpoint, data = null, qs = null) {
    const token = store.getState()?.authentication?.user?.accessToken;
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }

    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    let config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": localStorage.getItem("I18N_LANGUAGE") || "en",
      },
      body: formData,
    };
    return fetch(`${endpoint}?${params}`, config);
  },

  delete(endpoint, data = null, qs = null) {
    const token = store.getState()?.authentication?.user?.accessToken;
    let params = "";
    if (qs) {
      params = queryString.stringify(qs);
    }

    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    let config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": localStorage.getItem("I18N_LANGUAGE") || "en",
      },
      body: formData,
    };
    return fetch(`${endpoint}?${params}`, config);
  },
};
