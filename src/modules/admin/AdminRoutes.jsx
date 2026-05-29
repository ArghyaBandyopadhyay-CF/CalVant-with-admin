// /**
//  * AdminRoutes.jsx
//  * All /admin/* routes, wrapped in AdminLayout.
//  * Every route is guarded by AdminProtectedRoute (root role only).
//  *
//  * This file is imported once in the main CalVant App.js and
//  * mounted inside a <Route path="/admin"> block.
//  *
//  * Removed: Organisation, Blogs, Footer Content, Activity Logs
//  */
// import React from "react";
// import { Switch, Route, Redirect } from "react-router-dom";

// import AdminProtectedRoute from "./AdminProtectedRoute";
// import AdminLayout from "./AdminLayout";

// // ── Dashboard ──────────────────────────────────────────────────────────
// import AdminDashboard from "./components/Dashboard/AdminDashboard";

// // ── Users ──────────────────────────────────────────────────────────────
// import UserList from "./components/Users/UserList";
// import CreateUser from "./components/Users/CreateUser";
// import ListUser from "./components/Users/ListUser";
// import BulkUser from "./components/Users/BulkUser";

// // ── Departments ────────────────────────────────────────────────────────
// import CreateDept from "./components/Departments/CreateDept";
// import ListDept from "./components/Departments/ListDept";

// // ── Risks ──────────────────────────────────────────────────────────────
// import AddRisk from "./components/Risks/AddRisk";
// import RootBulkRisk from "./components/Risks/RootBulkRisk";
// import EditRisks from "./components/Risks/EditRisks";
// import RootRiskList from "./components/Risks/RootRiskList";

// // ── Trust Centre ────────────────────────────────────────────────────────
// import TrustCentreAdmin from "./components/TrustCentre/TrustCentreAdmin";
// import TrustCentreSharePage from "./components/TrustCentre/TrustCentreSharePage";

// // ── Control Ownership ───────────────────────────────────────────────────
// import ControlOwnerAdmin from "./components/ControlOwnership/ControlOwnerAdmin";

// // ── Consent Management ──────────────────────────────────────────────────
// import ConsentAdmin from "./components/ConsentManagement/ConsentAdmin";

// // ── Vendors ─────────────────────────────────────────────────────────────
// import VendorList from "./components/Vendors/VendorList";
// import VendorCreate from "./components/Vendors/VendorCreate";

// // ── Activity Logs ────────────────────────────────────────────────────────
// import ListOfLogs from "./components/Logs/ListOfLogs";

// import OnboardingModule from "../components/Onboarding/OnboardingModule";

// // ─────────────────────────────────────────────────────────────────────────
// // Wrap every page in AdminLayout so the admin sidebar is always shown
// // ─────────────────────────────────────────────────────────────────────────
// const withAdminLayout = (Component) => (props) => (
//   <AdminLayout>
//     <Component {...props} />
//   </AdminLayout>
// );

// export default function AdminRoutes() {
//   return (
//     <Switch>
//       <Route
//   path="/admin/onboarding"
//   element={
//     <AdminProtectedRoute>
//       {withAdminLayout(<OnboardingModule />)}
//     </AdminProtectedRoute>
//   }
// />
//       {/* Dashboard */}
//       <AdminProtectedRoute exact path="/admin" component={withAdminLayout(AdminDashboard)} />

//       {/* Users */}
//       <AdminProtectedRoute exact path="/admin/users" component={withAdminLayout(ListUser)} />
//       <AdminProtectedRoute exact path="/admin/users/create" component={withAdminLayout(CreateUser)} />
//       <AdminProtectedRoute exact path="/admin/users/bulk" component={withAdminLayout(BulkUser)} />
//       <AdminProtectedRoute exact path="/admin/users/edit/:id" component={withAdminLayout(UserList)} />

//       {/* Departments */}
//       <AdminProtectedRoute exact path="/admin/departments" component={withAdminLayout(ListDept)} />
//       <AdminProtectedRoute exact path="/admin/departments/create" component={withAdminLayout(CreateDept)} />

//       {/* Risks */}
//       <AdminProtectedRoute exact path="/admin/risks" component={withAdminLayout(RootRiskList)} />
//       <AdminProtectedRoute exact path="/admin/risks/add" component={withAdminLayout(AddRisk)} />
//       <AdminProtectedRoute exact path="/admin/risks/bulk" component={withAdminLayout(RootBulkRisk)} />
//       <AdminProtectedRoute exact path="/admin/risks/edit/:id" component={withAdminLayout(EditRisks)} />

//       {/* Trust Centre */}
//       <AdminProtectedRoute exact path="/admin/trust-centre" component={withAdminLayout(TrustCentreAdmin)} />
//       <Route exact path="/admin/trust-centre/:shareToken" component={TrustCentreSharePage} />

//       {/* Control Ownership */}
//       <AdminProtectedRoute exact path="/admin/control-ownership" component={withAdminLayout(ControlOwnerAdmin)} />

//       {/* Consent Management */}
//       <AdminProtectedRoute exact path="/admin/consent" component={withAdminLayout(ConsentAdmin)} />

//       {/* Vendors */}
//       <AdminProtectedRoute exact path="/admin/vendors" component={withAdminLayout(VendorList)} />
//       <AdminProtectedRoute exact path="/admin/vendors/create" component={withAdminLayout(VendorCreate)} />

//       {/* Activity Logs */}
//       <AdminProtectedRoute exact path="/admin/logs" component={withAdminLayout(ListOfLogs)} />

//       {/* Fallback */}
//       <Route path="/admin/*">
//         <Redirect to="/admin" />
//       </Route>
//     </Switch>
//   );
// }

import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLayout from "./AdminLayout";

// ── Dashboard ──────────────────────────────────────────────────────────
import AdminDashboard from "./components/Dashboard/AdminDashboard";

// ── Users ──────────────────────────────────────────────────────────────
import UserList from "./components/Users/UserList";
import CreateUser from "./components/Users/CreateUser";
import ListUser from "./components/Users/ListUser";
import BulkUser from "./components/Users/BulkUser";

// ── Departments ────────────────────────────────────────────────────────
import CreateDept from "./components/Departments/CreateDept";
import ListDept from "./components/Departments/ListDept";

// ── Risks ──────────────────────────────────────────────────────────────
import AddRisk from "./components/Risks/AddRisk";
import RootBulkRisk from "./components/Risks/RootBulkRisk";
import EditRisks from "./components/Risks/EditRisks";
import RootRiskList from "./components/Risks/RootRiskList";

// ── Trust Centre ────────────────────────────────────────────────────────
import TrustCentreAdmin from "./components/TrustCentre/TrustCentreAdmin";
import TrustCentreSharePage from "./components/TrustCentre/TrustCentreSharePage";

// ── Control Ownership ───────────────────────────────────────────────────
import ControlOwnerAdmin from "./components/ControlOwnership/ControlOwnerAdmin";

// ── Consent Management ──────────────────────────────────────────────────
import ConsentAdmin from "./components/ConsentManagement/ConsentAdmin";

// ── Vendors ─────────────────────────────────────────────────────────────
import VendorList from "./components/Vendors/VendorList";
import VendorCreate from "./components/Vendors/VendorCreate";

// ── Activity Logs ────────────────────────────────────────────────────────
import ListOfLogs from "./components/Logs/ListOfLogs";

// ── Onboarding ───────────────────────────────────────────────────────────
// File must be at: src/modules/admin/components/Onboarding/OnboardingModule.jsx
import OnboardingModule from "./components/Onboarding/OnboardingModule";

// ─────────────────────────────────────────────────────────────────────────
// Wrap every page in AdminLayout so the admin sidebar is always shown
// ─────────────────────────────────────────────────────────────────────────
const withAdminLayout = (Component) => (props) => (
  <AdminLayout>
    <Component {...props} />
  </AdminLayout>
);

export default function AdminRoutes() {
  return (
    <Switch>
      {/* ── Onboarding — shown first so root lands here after login ── */}
      <AdminProtectedRoute
        exact
        path="/admin/onboarding"
        component={withAdminLayout(OnboardingModule)}
      />

      {/* Dashboard */}
      <AdminProtectedRoute
        exact
        path="/admin"
        component={withAdminLayout(AdminDashboard)}
      />

      {/* Users */}
      <AdminProtectedRoute exact path="/admin/users"            component={withAdminLayout(ListUser)} />
      <AdminProtectedRoute exact path="/admin/users/create"     component={withAdminLayout(CreateUser)} />
      <AdminProtectedRoute exact path="/admin/users/bulk"       component={withAdminLayout(BulkUser)} />
      <AdminProtectedRoute exact path="/admin/users/edit/:id"   component={withAdminLayout(UserList)} />

      {/* Departments */}
      <AdminProtectedRoute exact path="/admin/departments"        component={withAdminLayout(ListDept)} />
      <AdminProtectedRoute exact path="/admin/departments/create" component={withAdminLayout(CreateDept)} />

      {/* Risks */}
      <AdminProtectedRoute exact path="/admin/risks"            component={withAdminLayout(RootRiskList)} />
      <AdminProtectedRoute exact path="/admin/risks/add"        component={withAdminLayout(AddRisk)} />
      <AdminProtectedRoute exact path="/admin/risks/bulk"       component={withAdminLayout(RootBulkRisk)} />
      <AdminProtectedRoute exact path="/admin/risks/edit/:id"   component={withAdminLayout(EditRisks)} />

      {/* Trust Centre */}
      <AdminProtectedRoute exact path="/admin/trust-centre" component={withAdminLayout(TrustCentreAdmin)} />
      <Route exact path="/admin/trust-centre/:shareToken"   component={TrustCentreSharePage} />

      {/* Control Ownership */}
      <AdminProtectedRoute exact path="/admin/control-ownership" component={withAdminLayout(ControlOwnerAdmin)} />

      {/* Consent Management */}
      <AdminProtectedRoute exact path="/admin/consent" component={withAdminLayout(ConsentAdmin)} />

      {/* Vendors */}
      <AdminProtectedRoute exact path="/admin/vendors"        component={withAdminLayout(VendorList)} />
      <AdminProtectedRoute exact path="/admin/vendors/create" component={withAdminLayout(VendorCreate)} />

      {/* Activity Logs */}
      <AdminProtectedRoute exact path="/admin/logs" component={withAdminLayout(ListOfLogs)} />

      {/* Fallback */}
      <Route path="/admin/*">
        <Redirect to="/admin" />
      </Route>
    </Switch>
  );
}