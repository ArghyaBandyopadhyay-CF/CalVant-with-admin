// /**
//  * adminApi.js
//  * Axios instance for all Admin Panel API calls.
//  * Uses CalVant's sessionStorage token (same auth as the main app).
//  */
// import axios from "axios";

// const ADMIN_API = axios.create({
//   baseURL: process.env.REACT_APP_SP + "/user-service/api",
//   withCredentials: true,
// });

// ADMIN_API.interceptors.request.use((config) => {
//   // Reuse CalVant's session token — no separate admin login needed
//   const token = sessionStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;

//   const user = JSON.parse(sessionStorage.getItem("user") || "{}");
//   if (user.organization) {
//     config.headers["x-org"] = user.organization;
//   }

//   // Region header — mirrors CalVant main app logic
//   const region = user.region || sessionStorage.getItem("selected_region") || "US";
//   if (region !== "AUTO") config.headers["x-region"] = region;

//   return config;
// });

// ADMIN_API.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       sessionStorage.clear();
//       window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );

// export default ADMIN_API;

import axios from "axios";

const ADMIN_API = axios.create({
    baseURL: process.env.REACT_APP_SP + "/user-service/api",
    withCredentials: true,
});

ADMIN_API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    const user  = JSON.parse(sessionStorage.getItem("user") || "{}");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (user.organization) {
        config.headers["x-org"] = user.organization;
    }

    // x-role — extract from array if needed e.g. ['root'] → 'root'
    const role = Array.isArray(user.role) ? user.role[0] : user.role;
    if (role) {
        config.headers["x-role"] = role;
    }

    // x-region — no hardcoded fallback; let backend default to "in"
    const region = user.region || sessionStorage.getItem("selected_region");
    if (region && region !== "AUTO") {
        config.headers["x-region"] = region;
    }

    return config;
});

ADMIN_API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            sessionStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default ADMIN_API;