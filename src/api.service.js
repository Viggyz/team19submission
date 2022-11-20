import axios from "axios";

import { encodeLocationId, backOffAPICall } from "./utils";

const BASE_URL = "http://localhost:8000/api";

const Client = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
});

const AuthClient = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
});

AuthClient.interceptors.request.use(function (config) {
  if (window.localStorage.getItem("access")) {
    config.headers['Authorization'] = `Bearer ${window.localStorage.getItem("access")}`;
    return Promise.resolve(config);
  }
  return Promise.reject(config);
}, function (error) {
  return Promise.reject(error);
});


AuthClient.interceptors.response.use(
  function (response) {
    return Promise.resolve(response);
  },
  function (error) {
    if (error.status === 401) {
      Auth.refreshToken()
        .then(() => {
          AuthClient.request(error.config) 
            .then((response) => Promise.resolve(response))
            .catch((err) => Promise.reject(err));
        })
        .catch((err) => Promise.reject(err));
    } else {
      Promise.reject(error);
    }
  }
);

export function searchPlaces(query) {
  // TODO do exponential backoff retries
  return backOffAPICall(
    Client.get,
    ["search", {
      params: {
        q: query,
      },
    }],
    (err) => {
      return err.status_code === 429;
    }
  );
}

export class Auth {
  static login({username, password}) {
    return new Promise((resolve, reject) => {
      Client.post("auth/login", {
        username,
        password,
      })
        .then(({data : { access, refresh }}) => {
          localStorage.setItem("access", access);
          localStorage.setItem("refresh", refresh);
          AuthClient.defaults.headers["Authorization"] = access;
          resolve(true);
        })
        .catch((err) => reject(err));
    });
  }

  static signUp({ username, email, password }) {
    return Client.post("auth/signup", {
      username,
      email,
      password,
    });
  }

  static refreshToken() {
    return new Promise((resolve, reject) => {
      if(localStorage.getItem("refresh")) {
        Client.post("auth/refresh_token", {
          refresh: localStorage.getItem("refresh"),
        })
          .then(({ access }) => {
            localStorage.setItem("access", access);
            AuthClient.defaults.headers["Authorization"] = access;
            resolve(access);
          })
          .catch((err) => {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            reject(err);
          });
      }
      else {
        reject('No token');
      }
    });
  }
}

export class Locations {
    static list(lon, lat) {
        let params = {
            lon,
            lat,
        };
        return backOffAPICall(
          Client.get,
          [
            "locations",
            {
              params,
            }
          ],
          (err) => err.status_code === 429
        )
    }

    static get(location) {
        const location_id = encodeLocationId(location);
        return Client.get(`locations/${location_id}`);
    }

    static events(location) {
        const location_id = encodeLocationId(location);
        return Client.get(`locations/${location_id}/events`)
    }

    static createEvent(location, payload) {
        const location_id = encodeLocationId(location);
        return AuthClient.post(`locations/${location_id}/events`, {
            ...payload,
            location: {
                osm_type_id: location_id,
                name: location.name,
                place: location.place,
                address: location.address,
            }
        })
    }
}

export class Events {
  static addIntrest(event_id) {
    return AuthClient.post(`events/${event_id}/interested`);
  }

  static removeIntrest(event_id) {
    return AuthClient.delete(`events/${event_id}/interested`);
  }

  static get(event_id) {
    return Client.get(`events/${event_id}`);
  }

  static update(event_id, payload) {
    return AuthClient.update(`events/${event_id}`, payload);
  }

  static delete(event_id) {
    return AuthClient.delete(`events/${event_id}`);
  }
}
