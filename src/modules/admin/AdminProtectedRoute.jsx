/**
 * AdminProtectedRoute.jsx
 * Route guard for all /admin/* routes.
 * Allows access ONLY if the logged-in user has the "root" role.
 * Non-root users are silently redirected to the main dashboard.
 */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isRootUser, isAdminAuthenticated } from "./utils/adminAuth";

const AdminProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAdminAuthenticated()) {
          return <Redirect to="/login" />;
        }
        if (!isRootUser()) {
          // Authenticated but not root → back to main app
          return <Redirect to="/" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default AdminProtectedRoute;
