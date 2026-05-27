// /**
//  * AdminLayout.jsx
//  * Wraps all /admin/* pages with a collapsible sidebar.
//  * Sidebar has grouped sub-menus for Users, Risks, Vendors.
//  */
// import React, { useState } from "react";
// import { useHistory, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   UserPlus,
//   Upload,
//   Building2,
//   ShieldCheck,
//   PlusCircle,
//   List,
//   Lock,
//   UserCheck,
//   Gavel,
//   Truck,
//   Activity,
//   ChevronLeft,
//   ChevronRight,
//   ChevronDown,
//   ChevronUp,
//   LogOut,
//   ArrowLeft,
// } from "lucide-react";

// // ── Nav structure with sub-menus ──────────────────────────────────────────────
// const NAV = [
//   {
//     label: "Dashboard",
//     icon: LayoutDashboard,
//     path: "/admin",
//     exact: true,
//   },
//   {
//     label: "Users",
//     icon: Users,
//     group: "users",
//     children: [
//       { label: "User List",        icon: List,     path: "/admin/users" },
//       { label: "Create User",      icon: UserPlus, path: "/admin/users/create" },
//       { label: "Bulk Upload",      icon: Upload,   path: "/admin/users/bulk" },
//     ],
//   },
//   {
//     label: "Departments",
//     icon: Building2,
//     path: "/admin/departments",
//   },
//   {
//     label: "Risks",
//     icon: ShieldCheck,
//     group: "risks",
//     children: [
//       { label: "Risk List",        icon: List,       path: "/admin/risks" },
//       { label: "Add Risk",         icon: PlusCircle, path: "/admin/risks/add" },
//       { label: "Bulk Upload",      icon: Upload,     path: "/admin/risks/bulk" },
//     ],
//   },
//   {
//     label: "Trust Centre",
//     icon: Lock,
//     path: "/admin/trust-centre",
//   },
//   {
//     label: "Control Ownership",
//     icon: UserCheck,
//     path: "/admin/control-ownership",
//   },
//   {
//     label: "Consent Mgmt",
//     icon: Gavel,
//     path: "/admin/consent",
//   },
//   {
//     label: "Vendors",
//     icon: Truck,
//     group: "vendors",
//     children: [
//       { label: "Vendor List",      icon: List,       path: "/admin/vendors" },
//       { label: "Add Vendor",       icon: PlusCircle, path: "/admin/vendors/create" },
//     ],
//   },
//   {
//     label: "Activity Logs",
//     icon: Activity,
//     path: "/admin/logs",
//   },
// ];

// const SIDEBAR_W   = 230;
// const COLLAPSED_W = 60;

// export default function AdminLayout({ children }) {
//   const [collapsed, setCollapsed]   = useState(false);
//   const [openGroups, setOpenGroups] = useState({ users: true, risks: false, vendors: false });
//   const history  = useHistory();
//   const location = useLocation();

//   const isActive = (path, exact = false) =>
//     exact
//       ? location.pathname === path
//       : location.pathname === path || location.pathname.startsWith(path + "/");

//   const isGroupActive = (children) =>
//     children.some((c) => isActive(c.path));

//   const toggleGroup = (group) =>
//     setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));

//   const sidebarWidth = collapsed ? COLLAPSED_W : SIDEBAR_W;

//   return (
//     <div className="flex min-h-screen bg-gray-50">

//       {/* ── Sidebar ── */}
//       <aside
//         style={{ width: sidebarWidth, transition: "width 0.25s ease" }}
//         className="fixed top-0 left-0 h-full bg-white border-r border-gray-100 shadow-sm flex flex-col z-[1002] overflow-hidden"
//       >
//         {/* Brand */}
//         <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
//           {!collapsed && (
//             <div className="flex items-center gap-2">
//               <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//                 <ShieldCheck size={14} className="text-white" />
//               </div>
//               <span className="text-sm font-bold text-gray-900">Admin Panel</span>
//             </div>
//           )}
//           <button
//             onClick={() => setCollapsed(!collapsed)}
//             className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors ml-auto"
//           >
//             {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
//           </button>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 overflow-y-auto py-3 px-2">
//           {NAV.map((item) => {
//             // ── Group item (has children) ──
//             if (item.children) {
//               const active = isGroupActive(item.children);
//               const open   = openGroups[item.group];
//               return (
//                 <div key={item.group}>
//                   {/* Group header */}
//                   <button
//                     onClick={() => collapsed ? null : toggleGroup(item.group)}
//                     title={collapsed ? item.label : undefined}
//                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 ${
//                       active
//                         ? "bg-indigo-50 text-indigo-700"
//                         : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//                     }`}
//                     style={{ justifyContent: collapsed ? "center" : "flex-start" }}
//                   >
//                     <item.icon size={17} className="flex-shrink-0" />
//                     {!collapsed && (
//                       <>
//                         <span className="flex-1 text-left">{item.label}</span>
//                         {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//                       </>
//                     )}
//                   </button>

//                   {/* Children — shown when expanded and sidebar not collapsed */}
//                   {!collapsed && open && (
//                     <div className="ml-4 pl-3 border-l-2 border-indigo-100 mb-1">
//                       {item.children.map((child) => (
//                         <button
//                           key={child.path}
//                           onClick={() => history.push(child.path)}
//                           className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 text-sm transition-all duration-150 ${
//                             isActive(child.path)
//                               ? "bg-indigo-100 text-indigo-700 font-semibold"
//                               : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-medium"
//                           }`}
//                         >
//                           <child.icon size={15} className="flex-shrink-0" />
//                           <span>{child.label}</span>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             // ── Single item ──
//             const active = isActive(item.path, item.exact);
//             return (
//               <button
//                 key={item.path}
//                 onClick={() => history.push(item.path)}
//                 title={collapsed ? item.label : undefined}
//                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 ${
//                   active
//                     ? "bg-indigo-50 text-indigo-700"
//                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//                 }`}
//                 style={{ justifyContent: collapsed ? "center" : "flex-start" }}
//               >
//                 <item.icon size={17} className="flex-shrink-0" />
//                 {!collapsed && <span>{item.label}</span>}
//               </button>
//             );
//           })}
//         </nav>

//         {/* Footer */}
//         <div className="border-t border-gray-100 py-3 px-2 space-y-1">
//           <button
//             onClick={() => history.push("/")}
//             title={collapsed ? "Back to CalVant" : undefined}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
//             style={{ justifyContent: collapsed ? "center" : "flex-start" }}
//           >
//             <ArrowLeft size={17} className="flex-shrink-0" />
//             {!collapsed && <span>Back to CalVant</span>}
//           </button>
//           <button
//             onClick={() => { sessionStorage.clear(); history.push("/login"); }}
//             title={collapsed ? "Logout" : undefined}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
//             style={{ justifyContent: collapsed ? "center" : "flex-start" }}
//           >
//             <LogOut size={17} className="flex-shrink-0" />
//             {!collapsed && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* ── Main content ── */}
//       <main
//         style={{
//           marginLeft: sidebarWidth,
//           transition: "margin-left 0.25s ease",
//           minHeight: "100vh",
//           width: `calc(100% - ${sidebarWidth}px)`,
//         }}
//         className="flex flex-col"
//       >
//         {/* Top bar */}
//         <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
//           <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
//             Admin Panel
//           </span>
//           <div className="flex items-center gap-2">
//             <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
//               <span className="text-xs font-bold text-indigo-700">R</span>
//             </div>
//             <span className="text-sm text-gray-600 font-medium">Root Admin</span>
//           </div>
//         </header>

//         <div className="flex-1 p-6 overflow-auto">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }

/**
 * AdminLayout.jsx
 * Wraps all /admin/* pages with a collapsible sidebar.
 * Sidebar has grouped sub-menus for Users, Risks, Vendors.
 */
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Upload,
  Building2,
  ShieldCheck,
  PlusCircle,
  List,
  Lock,
  UserCheck,
  Gavel,
  Truck,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  ArrowLeft,
} from "lucide-react";

// ── Nav structure with sub-menus ──────────────────────────────────────────────
const NAV = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
    exact: true,
  },
  {
    label: "Users",
    icon: Users,
    group: "users",
    children: [
      { label: "User List",        icon: List,     path: "/admin/users" },
      { label: "Create User",      icon: UserPlus, path: "/admin/users/create" },
      { label: "Bulk Upload",      icon: Upload,   path: "/admin/users/bulk" },
    ],
  },
  {
    label: "Departments",
    icon: Building2,
    group: "departments",
    children: [
      { label: "Dept List",        icon: List,       path: "/admin/departments" },
      { label: "Create Dept",      icon: PlusCircle, path: "/admin/departments/create" },
    ],
  },
  {
    label: "Risks",
    icon: ShieldCheck,
    group: "risks",
    children: [
      { label: "Risk List",        icon: List,       path: "/admin/risks" },
      { label: "Add Risk",         icon: PlusCircle, path: "/admin/risks/add" },
      { label: "Bulk Upload",      icon: Upload,     path: "/admin/risks/bulk" },
    ],
  },
  {
    label: "Trust Centre",
    icon: Lock,
    path: "/admin/trust-centre",
  },
  {
    label: "Control Ownership",
    icon: UserCheck,
    path: "/admin/control-ownership",
  },
  {
    label: "Consent Mgmt",
    icon: Gavel,
    path: "/admin/consent",
  },
  {
    label: "Vendors",
    icon: Truck,
    group: "vendors",
    children: [
      { label: "Vendor List",      icon: List,       path: "/admin/vendors" },
      { label: "Add Vendor",       icon: PlusCircle, path: "/admin/vendors/create" },
    ],
  },
  {
    label: "Activity Logs",
    icon: Activity,
    path: "/admin/logs",
  },
];

const SIDEBAR_W   = 230;
const COLLAPSED_W = 60;

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [openGroups, setOpenGroups] = useState({ users: true, departments: false, risks: false, vendors: false });
  const history  = useHistory();
  const location = useLocation();

  const isActive = (path, exact = false) =>
    exact
      ? location.pathname === path
      : location.pathname === path || location.pathname.startsWith(path + "/");

  const isGroupActive = (children) =>
    children.some((c) => isActive(c.path));

  const toggleGroup = (group) =>
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));

  const sidebarWidth = collapsed ? COLLAPSED_W : SIDEBAR_W;

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar ── */}
      <aside
        style={{ width: sidebarWidth, transition: "width 0.25s ease" }}
        className="fixed top-0 left-0 h-full bg-white border-r border-gray-100 shadow-sm flex flex-col z-[1002] overflow-hidden"
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <ShieldCheck size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV.map((item) => {
            // ── Group item (has children) ──
            if (item.children) {
              const active = isGroupActive(item.children);
              const open   = openGroups[item.group];
              return (
                <div key={item.group}>
                  {/* Group header */}
                  <button
                    onClick={() => collapsed ? null : toggleGroup(item.group)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    style={{ justifyContent: collapsed ? "center" : "flex-start" }}
                  >
                    <item.icon size={17} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </>
                    )}
                  </button>

                  {/* Children — shown when expanded and sidebar not collapsed */}
                  {!collapsed && open && (
                    <div className="ml-4 pl-3 border-l-2 border-indigo-100 mb-1">
                      {item.children.map((child) => (
                        <button
                          key={child.path}
                          onClick={() => history.push(child.path)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-0.5 text-sm transition-all duration-150 ${
                            isActive(child.path)
                              ? "bg-indigo-100 text-indigo-700 font-semibold"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-medium"
                          }`}
                        >
                          <child.icon size={15} className="flex-shrink-0" />
                          <span>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // ── Single item ──
            const active = isActive(item.path, item.exact);
            return (
              <button
                key={item.path}
                onClick={() => history.push(item.path)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{ justifyContent: collapsed ? "center" : "flex-start" }}
              >
                <item.icon size={17} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 py-3 px-2 space-y-1">
          <button
            onClick={() => history.push("/")}
            title={collapsed ? "Back to CalVant" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            <ArrowLeft size={17} className="flex-shrink-0" />
            {!collapsed && <span>Back to CalVant</span>}
          </button>
          <button
            onClick={() => { sessionStorage.clear(); history.push("/login"); }}
            title={collapsed ? "Logout" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            <LogOut size={17} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.25s ease",
          minHeight: "100vh",
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
        className="flex flex-col"
      >
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Admin Panel
          </span>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-700">R</span>
            </div>
            <span className="text-sm text-gray-600 font-medium">Root Admin</span>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}