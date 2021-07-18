import queryString from "query-string"
import fetch from "./fetch"

const token = ""

export default {
  get(endpoint, qs = null) {
    let params = ""
    if (qs) {
      params = queryString.stringify(qs)
    }
    let config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    return fetch(`${endpoint}?${params}`, config)
  },

  post(endpoint, data = null, qs = null) {
    let params = ""
    if (qs) {
      params = queryString.stringify(qs)
    }

    var formData = new FormData()

    if (Array.isArray(data) && data.length > 0) {
      data.map(item => {
        for (var key in item) {
          formData.append(key, item[key])
        }
      })
    } else {
      for (var key in data) {
        formData.append(key, data[key])
      }
    }
    let config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
    return fetch(`${endpoint}?${params}`, config)
  },

  put(endpoint, data = null, qs = null) {
    let params = ""
    if (qs) {
      params = queryString.stringify(qs)
    }

    var formData = new FormData()
    for (var key in data) {
      formData.append(key, data[key])
    }
    let config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
    return fetch(`${endpoint}?${params}`, config)
  },

  delete(endpoint, data = null, qs = null) {
    let params = ""
    if (qs) {
      params = queryString.stringify(qs)
    }

    var formData = new FormData()
    for (var key in data) {
      formData.append(key, data[key])
    }
    let config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
    return fetch(`${endpoint}?${params}`, config)
  },
}
