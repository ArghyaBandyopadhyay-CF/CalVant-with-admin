import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_SP + "/user-service/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  if (user.organization) config.headers["x-org"] = user.organization;

  const region = user.region || sessionStorage.getItem("selected_region") || "US";
  if (region !== "AUTO") config.headers["x-region"] = region;

  return config;
});

export default API;
