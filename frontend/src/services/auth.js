import { api } from "../lib/api";

export function staffLogin(credentials) {
  return api.post("token/", credentials).then((res) => res.data);
}

export function staffRefresh(refreshToken) {
  return api.post("token/refresh/", { refresh: refreshToken }).then((res) => res.data);
}

export function getProfile() {
  return api.get("auth/profile/").then((res) => res.data);
}

export function updateProfile(payload) {
  return api.put("auth/profile/", payload).then((res) => res.data);
}

export function changePassword(payload) {
  return api.post("auth/change-password/", payload).then((res) => res.data);
}

export function listUsers() {
  return api.get("auth/users/").then((res) => res.data);
}

export function setUserPassword(userId, newPassword) {
  return api
    .post("auth/set-password/", { user_id: userId, new_password: newPassword })
    .then((res) => res.data);
}
