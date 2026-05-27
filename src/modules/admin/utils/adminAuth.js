/**
 * adminAuth.js
 * Auth helpers for the Admin Panel module.
 * Reads from CalVant's sessionStorage (not localStorage).
 */

export const getAdminToken = () => sessionStorage.getItem("token");

export const getAdminUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const isAdminAuthenticated = () => !!getAdminToken();

/**
 * Returns true only if the currently logged-in user has the "root" role.
 * root = Client Admin — the only role that can access the Admin Panel.
 */
export const isRootUser = () => {
  const user = getAdminUser();
  if (!user) return false;
  const roles = Array.isArray(user.role) ? user.role : [user.role];
  return roles.includes("root");
};
