// AUTH
export const AUTH = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  PROFILE: "/auth/profile",
};

// USERS
export const USERS = {
  PROFILE: "/users/profile",
  USER_BY_ID: (id) => `/users/${id}`,
};

// ACTIVITIES
export const ACTIVITIES = {
  CREATE: "/activities",
  GET_ONE: (id) => `/activities/${id}`,
  JOIN: (id) => `/activities/${id}/join`,
  NEARBY: (lat, lng, radius) => `/activities/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
  PARTICIPANTS: (id) => `/activities/${id}/participants`,
  START: (id) => `/activities/${id}/start`,
  END: (id) => `/activities/${id}/end`,

  // new:
  SEARCH: (q, lat, lng, radius) => {
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (lat && lng) {
      params.append("lat", lat);
      params.append("lng", lng);
    }
    if (radius) params.append("radius", radius);
    return `/activities/search?${params.toString()}`;
  },

  AUTOCOMPLETE: (q, limit = 6) => `/activities/autocomplete?q=${encodeURIComponent(q)}&limit=${limit}`,
};

// CHATS
export const CHATS = {
  GET_CHATS: (activityId) => `/chats/${activityId}`,
  SEND_CHAT: "/chats", // POST
};

// LIVE LOCATION
export const LIVE = {
  UPDATE: "/location/update", // POST
  GET_ALL: (activityId) => `/location/${activityId}`,
};
