import axios from "axios";

import { encodeLocationId, backOffAPICall } from "./utils";

const BASE_URL = "http://localhost:8000/api";

const Client = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
});

const AuthClient = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
  headers: { 'Authorization': `Bearer ${localStorage.getItem("access")}` },
});

AuthClient.interceptors.request.use(function (config) {
  if (window.localStorage.getItem("access")) {
    config.headers['Authorization'] = `Bearer ${window.localStorage.getItem("access")}`;
    return config;
  }
  return Promise.reject(config);
}, function (error) {
  return Promise.reject(error);
});


AuthClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      return new Promise((resolve, reject) => {
        Auth.refreshToken()
          .then((access) => {
            Client.request({...error.config, 
              headers: {...error.config.headers, 'Authorization': `Bearer ${access}`}
            }) 
              .then((response) => resolve(response))
              .catch((err) => reject(err));
          })
          .catch((err) => reject(err));
      })
    } else {
      return Promise.reject(error);
    }
  }
);

export function searchPlaces(query) {
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
          dispatchEvent(new Event("addTokens"))
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
          .then(({data: { access }}) => {
            localStorage.setItem("access", access);
            AuthClient.defaults.headers["Authorization"] = access;
            resolve(access);
          })
          .catch((err) => {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            dispatchEvent(new Event("removeTokens"))
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
    static search(lon, lat) {
        let params = {
            lon,
            lat,
        };
        return backOffAPICall(
          Client.get,
          [
            "locations/search",
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

    static events(location, osm_type_id=null) {
        const location_id = osm_type_id || encodeLocationId(location);
        return Client.get(`locations/${location_id}/events`)
    }

    static  createEvent(location, payload) {
        const location_id = encodeLocationId(location);
        return AuthClient.post(`locations/${location_id}/events`, {
            ...payload,
            location: {
                osm_type_id: location_id,
                name: location.name,
                place: location.display_name,
                address: location.address,
                lat: location.lat,
                lon: location.lon,
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

  static list(query=null) {
    let params = query && {'city': query}; 
    return Client.get('events', {
      params
    });
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

export class User {
  static createdEvents() {
      return AuthClient.get('user/events/created');
    }
  static interestedEvents() {
      return AuthClient.get('user/events/interested');
  }
}