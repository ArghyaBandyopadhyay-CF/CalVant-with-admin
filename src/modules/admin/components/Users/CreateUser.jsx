// import React, { useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";
// import axios from "../../api/adminAxios";
// import api from "../../api/adminApi";
// import { Link, useHistory } from "react-router-dom";

// // MUI Imports
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   OutlinedInput,
//   CircularProgress,
//   Stack,
//   Alert,
//   Chip,
// } from "@mui/material";

// // Icons
// import SaveIcon from "@mui/icons-material/Save";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// const TPRM_VENDORS_URL = `${process.env.REACT_APP_SP}/tprm-service/api/tprm/vendors`;

// export default function UserForm({ userToEdit = null, onSuccess }) {
//   const history = useHistory();
//   const [loading, setLoading] = useState(false);
//   const [departments, setDepartments] = useState([]);
//   const [organizations, setOrganizations] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [vendorMap, setVendorMap] = useState({});  // id → displayName
//   const [error, setError] = useState("");

//   // Decode JWT
//   const token = sessionStorage.getItem("token");
//   const decoded = token ? jwtDecode(token) : null;
//   const myObject = JSON.parse(sessionStorage.getItem("user") || "{}");

//   const loggedInRole = Array.isArray(decoded?.role)
//     ? decoded.role[0]
//     : decoded?.role;

//   const userOrg = myObject?.organization || decoded?.organization;

//   // Role options
//   const roles =
//     loggedInRole === "super_admin"
//       ? ["root"]
//       : [
//         "steering_committee_member",
//         "risk_owner",
//         "risk_manager",
//         "process_owner",
//         "process_manager",
//         "auditor",
//         "audit_manager",
//         "user",
//         "dpo",
//         "ciso",
//         "aio"
//       ];

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: [],
//     department: [],
//     organization: "",
//     modules: [],
//     vendors: [],
//   });

//   const normalizeArray = (data, keepEmpty = false) => {
//     if (!data) return [];
//     if (Array.isArray(data)) {
//       if (keepEmpty) return data; // Keep empty strings when needed
//       return data.filter(Boolean);
//     }
//     if (typeof data === "string") {
//       if (data.trim() === "") return [];
//       return data.split(",").map((s) => s.trim()).filter(Boolean);
//     }
//     return [];
//   };

//   // ── Derived booleans ──────────────────────────────────────────────────────
//   const isUserRole = formData.role.includes("user");
//   const isSteeringRole = formData.role.includes("steering_committee_member"); // ✅ Added Support
  
//   const isTprmSelected = formData.modules.includes("tprm");
//   const isDeptSelected = formData.department.length > 0;
//   // Check if any of the special roles (dpo, ciso, aio) are selected
//   const hasSpecialRole = formData.role.some(role => ["dpo", "ciso", "aio"].includes(role));
  
//   // Show department when:
//   // 1. Special roles are selected (dpo, ciso, aio), OR
//   // 2. User or Steering role is selected but tprm is NOT selected, OR
//   // 3. Non-user/non-steering roles are selected (but not special roles when they're the only selection)
//   const showDepartment = loggedInRole === "root" && (
//     hasSpecialRole || 
//     !(isUserRole || isSteeringRole) || 
//     ((isUserRole || isSteeringRole) && !isTprmSelected)
//   );
  
//   // Show vendors dropdown only when user/steering role AND tprm module is selected
//   const showVendors = loggedInRole === "root" && (isUserRole || isSteeringRole) && isTprmSelected;
  
//   // isAuditor auto-derived from role — not shown in UI
//   const isAuditorAuto =
//     formData.role.includes("auditor") || formData.role.includes("audit_manager");

//   // ── Fetch Departments (root only) ─────────────────────────────────────────
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       if (loggedInRole === "root") {
//         try {
//           const myObj = JSON.parse(sessionStorage.getItem("user") || "{}");
//           const orgId = myObj?.organization || userOrg;
//           console.log("Fetching departments for org:", orgId);
//           const res = await api.get("/departments", { params: { organization: orgId } });
//           const all = Array.isArray(res.data) ? res.data : [];
//           console.log("Departments fetched:", all);
//           setDepartments(all.filter((d) => d.organization === orgId));
//         } catch (err) {
//           console.error("Department fetch failed:", err.response?.status, err.message);
//           setError("Failed to load departments");
//         }
//       }
//     };
//     fetchDepartments();
//   }, [loggedInRole, userOrg]);

//   // ── Fetch Organizations (super_admin only) ────────────────────────────────
//   useEffect(() => {
//     const fetchOrganizations = async () => {
//       if (loggedInRole === "super_admin") {
//         const res = await api.get("/organizations");
//         setOrganizations(Array.isArray(res.data) ? res.data : []);
//       }
//     };
//     fetchOrganizations();
//   }, [loggedInRole]);

//   // ── Fetch Vendors when tprm module is selected ────────────────────────────
//   useEffect(() => {
//     if (!isTprmSelected) {
//       setVendors([]);
//       return;
//     }
//     const fetchVendors = async () => {
//       try {
//         const myObj = JSON.parse(sessionStorage.getItem("user") || "{}");
//         const orgId = myObj?.organization || userOrg;
//         const res = await axios.get(TPRM_VENDORS_URL, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { organization: orgId },
//         });
//         const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
//         setVendors(data);
//         // Build id → name map so chips always show names, not raw IDs
//         const map = {};
//         data.forEach((v) => {
//           // API may return id, _id, or vendorId — try all
//           const id = v.id ?? v._id ?? v.vendorId;
//           if (id) map[String(id)] = v.vendorName || v.name || String(id);
//         });
//         setVendorMap((prev) => ({ ...prev, ...map }));
//       } catch (err) {
//         console.error("Vendor fetch failed:", err.message);
//       }
//     };
//     fetchVendors();
//   }, [isTprmSelected]);

//   // ── Prefill in edit mode ───────────────────────────────────────────────────
//   useEffect(() => {
//     if (userToEdit) {
//       setFormData({
//         name: userToEdit.name || "",
//         email: userToEdit.email || "",
//         password: "",
//         role: normalizeArray(userToEdit.role),
//         department: normalizeArray(userToEdit.department),
//         organization: userToEdit.organization || "",
//         modules: normalizeArray(userToEdit.modules),
//         vendors: normalizeArray(userToEdit.vendors),
//       });
//     }
//   }, [userToEdit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleMultiChange = (e) => {
//     const { name, value } = e.target;
//     const newValue = Array.isArray(value) ? value : normalizeArray(value);

//     if (name === "department") {
//       const isRiskOwner = formData.role.includes("risk_owner");
//       if (isRiskOwner && newValue.length > 1) {
//         setFormData((prev) => ({ ...prev, [name]: [newValue[newValue.length - 1]] }));
//         return;
//       }
//     }

//     setFormData((prev) => {
//       let finalNewValue = [...newValue];

//       if (name === "role") {
//         const hasUser = finalNewValue.includes("user");
//         const hasOther = finalNewValue.some((r) => r !== "user");
//         const hasSpecial = finalNewValue.some((r) => ["dpo", "ciso", "aio"].includes(r));
        
//         if (hasUser && hasOther) {
//           if (prev.role.includes("user")) {
//             finalNewValue = finalNewValue.filter((r) => r !== "user");
//           } else {
//             finalNewValue = ["user"];
//           }
//         }
        
//         // Clear modules & vendors if no longer "user" or "steering_committee_member" role
//         if (!finalNewValue.includes("user") && !finalNewValue.includes("steering_committee_member")) {
//           return { ...prev, [name]: finalNewValue, modules: [], vendors: [] };
//         }
//       }

//       // If modules change and tprm is removed, clear vendors
//       if (name === "modules" && !finalNewValue.includes("tprm")) {
//         return { ...prev, [name]: finalNewValue, vendors: [] };
//       }

//       // If modules change and tprm is added, clear department (backend expects empty array, not [""])
//       if (name === "modules" && finalNewValue.includes("tprm")) {
//         return { ...prev, [name]: finalNewValue, department: [] };
//       }

//       return { ...prev, [name]: finalNewValue };
//     });
//   };

//   const handleChipDelete = (fieldName, valueToRemove) => {
//     setFormData((prev) => {
//       const updated = {
//         ...prev,
//         [fieldName]: prev[fieldName].filter((v) => v !== valueToRemove),
//       };
//       if (fieldName === "role" && (valueToRemove === "user" || valueToRemove === "steering_committee_member")) {
//         updated.modules = [];
//         updated.vendors = [];
//       }
//       if (fieldName === "modules" && valueToRemove === "tprm") {
//         updated.vendors = [];
//       }
//       return updated;
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const rolesArr = normalizeArray(formData.role);
//       const vendorsArr = normalizeArray(formData.vendors);

//       const payload = {
//         name: formData.name,
//         email: formData.email.toLowerCase(),
//         role: rolesArr,
//         department:
//           loggedInRole === "super_admin"
//             ? []  
//             : isTprmSelected
//               ? []  // Send empty array when TPRM is selected
//               : normalizeArray(formData.department),
//         organization:
//           loggedInRole === "super_admin"
//             ? formData.organization
//             : isTprmSelected && vendorsArr.length > 0
//               ? vendorsArr[0]  // Use first vendor as organization string when TPRM selected
//               : userOrg,
//         // Auto-derive isAuditor from role — not user-input
//         isAuditor: rolesArr.includes("auditor") || rolesArr.includes("audit_manager"),
//         // Only send modules for "user" or "steering_committee_member" role
//         modules: (rolesArr.includes("user") || rolesArr.includes("steering_committee_member")) ? normalizeArray(formData.modules) : [],
//         // Vendors only when tprm module selected
//         vendors: isTprmSelected ? vendorsArr : [],
//       };

//       if (!userToEdit || formData.password) {
//         payload.password = formData.password;
//       }

//       if (userToEdit) {
//         await api.post("/users/update", { ...payload, id: userToEdit.id });
//         alert("User updated successfully!");
//         onSuccess ? onSuccess() : history.goBack();
//       } else {
//         await api.post("/users/register", payload);
//         alert("User created successfully!");
//         setFormData({
//           name: "",
//           email: "",
//           password: "",
//           role: [],
//           department: [],
//           organization: "",
//           modules: [],
//           vendors: [],
//         });
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || err.response?.data || "Failed to save user");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDeptLabel = (id) => {
//     const dept = departments.find((d) => d.id === id);
//     return dept ? dept.name : id;
//   };

//   const getVendorLabel = (id) =>
//     // Check vendorMap first (persists even after vendors list clears)
//     vendorMap[String(id)] || id;

//   return (
//     <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
//       <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%" }}>
//         <Stack direction="row" spacing={1} mb={3}>
//           <Button startIcon={<ArrowBackIcon />} onClick={() => history.push("/users/list")}>
//             List
//           </Button>
//           <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center", pr: 8 }}>
//             {userToEdit ? "Edit User" : "Create User"}
//           </Typography>
//         </Stack>

//         {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

//         <form onSubmit={handleSubmit}>
//           <Stack spacing={2}>
//             {/* Basic Info */}
//             <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
//             <TextField label="Email" name="email" value={formData.email} onChange={handleChange} required />
//             <TextField
//               label={userToEdit ? "New Password" : "Password"}
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               required={!userToEdit}
//             />

//             {/* Roles */}
//             <FormControl fullWidth>
//               <InputLabel>Roles</InputLabel>
//               <Select
//                 multiple
//                 name="role"
//                 value={formData.role}
//                 onChange={handleMultiChange}
//                 input={<OutlinedInput label="Roles" />}
//                 renderValue={(selected) => (
//                   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                     {selected.map((val) => (
//                       <Chip key={val} label={val} size="small"
//                         onDelete={() => handleChipDelete("role", val)}
//                         onMouseDown={(e) => e.stopPropagation()} />
//                     ))}
//                   </Box>
//                 )}
//               >
//                 {roles
//                   .filter((r) => {
//                     if (r === "user" && formData.role.some((s) => s !== "user")) return false;
//                     return true;
//                   })
//                   .map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
//               </Select>
//             </FormControl>

//             {/* Modules — only for role=user or steering_committee_member (root only), shown BEFORE department */}
//             {loggedInRole === "root" && (isUserRole || isSteeringRole) && (
//               <FormControl fullWidth>
//                 <InputLabel>Modules</InputLabel>
//                 <Select
//                   multiple
//                   name="modules"
//                   value={formData.modules}
//                   onChange={handleMultiChange}
//                   input={<OutlinedInput label="Modules" />}
//                   renderValue={(selected) => (
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                       {selected.map((val) => (
//                         <Chip key={val} label={val} size="small"
//                           onDelete={() => handleChipDelete("modules", val)}
//                           onMouseDown={(e) => e.stopPropagation()} />
//                       ))}
//                     </Box>
//                   )}
//                 >
//                   {["audit", "compliance", "policies", "risk", "tprm"].map((m) => (
//                     <MenuItem key={m} value={m}>{m}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             )}

//             {/* Vendors dropdown — only when tprm module is selected */}
//             {showVendors && (
//               <FormControl fullWidth>
//                 <InputLabel>Vendors (TPRM)</InputLabel>
//                 <Select
//                   multiple
//                   name="vendors"
//                   value={formData.vendors}
//                   onChange={handleMultiChange}
//                   input={<OutlinedInput label="Vendors (TPRM)" />}
//                   renderValue={(selected) => (
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                       {selected.map((val) => (
//                         <Chip key={val} label={getVendorLabel(val)} size="small"
//                           onDelete={() => handleChipDelete("vendors", val)}
//                           onMouseDown={(e) => e.stopPropagation()} />
//                       ))}
//                     </Box>
//                   )}
//                 >
//                   {vendors.length === 0 ? (
//                     <MenuItem disabled>No vendors found</MenuItem>
//                   ) : (
//                     vendors.map((v) => {
//                       const id = v.id || v._id;
//                       return (
//                         <MenuItem key={id} value={id}>
//                           {v.vendorName || v.name}
//                         </MenuItem>
//                       );
//                     })
//                   )}
//                 </Select>
//               </FormControl>
//             )}

//             {/* Department — shown for special roles (dpo, ciso, aio) and other conditions */}
//             {showDepartment && (
//               <FormControl fullWidth>
//                 <InputLabel>Department</InputLabel>
//                 <Select
//                   multiple
//                   name="department"
//                   value={formData.department}
//                   onChange={handleMultiChange}
//                   input={<OutlinedInput label="Department" />}
//                   renderValue={(selected) => (
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                       {selected.map((val) => (
//                         <Chip key={val} label={getDeptLabel(val)} size="small"
//                           onDelete={() => handleChipDelete("department", val)}
//                           onMouseDown={(e) => e.stopPropagation()} />
//                       ))}
//                     </Box>
//                   )}
//                 >
//                   {departments.length === 0 ? (
//                     <MenuItem disabled>No departments available</MenuItem>
//                   ) : (
//                     departments.map((d) => (
//                       <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
//                     ))
//                   )}
//                 </Select>
//               </FormControl>
//             )}

//             {/* Organization (super_admin only) */}
//             {loggedInRole === "super_admin" && (
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//                 <FormControl fullWidth>
//                   <InputLabel>Organization</InputLabel>
//                   <Select
//                     name="organization"
//                     value={formData.organization}
//                     onChange={handleChange}
//                     input={<OutlinedInput label="Organization" />}
//                     required
//                   >
//                     {organizations.map((org) => (
//                       <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//                 <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                   <Link to="/organizations/create" style={{ textDecoration: "none" }}>
//                     <Button size="small" variant="text">+ Create Organization</Button>
//                   </Link>
//                 </Box>
//               </Box>
//             )}

//             <Button
//               type="submit"
//               variant="contained"
//               disabled={loading}
//               startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
//             >
//               {userToEdit ? "Update User" : "Create User"}
//             </Button>
//           </Stack>
//         </form>
//       </Paper>
//     </Box>
//   );
// }

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "../../api/adminAxios";
import api from "../../api/adminApi";
import { Link, useHistory } from "react-router-dom";

// MUI Imports
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  CircularProgress,
  Stack,
  Alert,
  Chip,
} from "@mui/material";

// Icons
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TPRM_VENDORS_URL = `${process.env.REACT_APP_SP}/tprm-service/api/tprm/vendors`;

export default function UserForm({ userToEdit = null, onSuccess }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorMap, setVendorMap] = useState({});  // id → displayName
  const [error, setError] = useState("");
  const [userLimitInfo, setUserLimitInfo] = useState(null); // { current, max }

  // Decode JWT
  const token = sessionStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const myObject = JSON.parse(sessionStorage.getItem("user") || "{}");

  const loggedInRole = Array.isArray(decoded?.role)
    ? decoded.role[0]
    : decoded?.role;

  const userOrg = myObject?.organization || decoded?.organization;

  // Role options
  const roles =
    loggedInRole === "super_admin"
      ? ["root"]
      : [
        "steering_committee_member",
        "risk_owner",
        "risk_manager",
        "process_owner",
        "process_manager",
        "auditor",
        "audit_manager",
        "user",
        "dpo",
        "ciso",
        "aio"
      ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: [],
    department: [],
    organization: "",
    modules: [],
    vendors: [],
  });

  const normalizeArray = (data, keepEmpty = false) => {
    if (!data) return [];
    if (Array.isArray(data)) {
      if (keepEmpty) return data; // Keep empty strings when needed
      return data.filter(Boolean);
    }
    if (typeof data === "string") {
      if (data.trim() === "") return [];
      return data.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  // ── Derived booleans ──────────────────────────────────────────────────────
  const isUserRole = formData.role.includes("user");
  const isSteeringRole = formData.role.includes("steering_committee_member"); // ✅ Added Support
  
  const isTprmSelected = formData.modules.includes("tprm");
  const isDeptSelected = formData.department.length > 0;
  // Check if any of the special roles (dpo, ciso, aio) are selected
  const hasSpecialRole = formData.role.some(role => ["dpo", "ciso", "aio"].includes(role));
  
  // Show department when:
  // 1. Special roles are selected (dpo, ciso, aio), OR
  // 2. User or Steering role is selected but tprm is NOT selected, OR
  // 3. Non-user/non-steering roles are selected (but not special roles when they're the only selection)
  const showDepartment = loggedInRole === "root" && (
    hasSpecialRole || 
    !(isUserRole || isSteeringRole) || 
    ((isUserRole || isSteeringRole) && !isTprmSelected)
  );
  
  // Show vendors dropdown only when user/steering role AND tprm module is selected
  const showVendors = loggedInRole === "root" && (isUserRole || isSteeringRole) && isTprmSelected;
  
  // isAuditor auto-derived from role — not shown in UI
  const isAuditorAuto =
    formData.role.includes("auditor") || formData.role.includes("audit_manager");

  // ── Fetch Org user limit (root only) ────────────────────────────────────
  useEffect(() => {
    if (loggedInRole !== "root" || userToEdit) return;
    const fetchLimit = async () => {
      try {
        const [usersRes, orgRes] = await Promise.all([
          api.get("/users"),
          api.get(`/organizations/${userOrg}`),
        ]);
        const currentCount = Array.isArray(usersRes.data) ? usersRes.data.length : 0;
        const maxUsers = orgRes.data?.maxUsers ?? null;
        setUserLimitInfo({ current: currentCount, max: maxUsers });
      } catch {
        // silently ignore — limit check is best-effort
      }
    };
    fetchLimit();
  }, [loggedInRole, userOrg, userToEdit]);

  // ── Fetch Departments (root only) ─────────────────────────────────────────
  useEffect(() => {
    const fetchDepartments = async () => {
      if (loggedInRole === "root") {
        try {
          const myObj = JSON.parse(sessionStorage.getItem("user") || "{}");
          const orgId = myObj?.organization || userOrg;
          console.log("Fetching departments for org:", orgId);
          const res = await api.get("/departments", { params: { organization: orgId } });
          const all = Array.isArray(res.data) ? res.data : [];
          console.log("Departments fetched:", all);
          setDepartments(all.filter((d) => d.organization === orgId));
        } catch (err) {
          console.error("Department fetch failed:", err.response?.status, err.message);
          setError("Failed to load departments");
        }
      }
    };
    fetchDepartments();
  }, [loggedInRole, userOrg]);

  // ── Fetch Organizations (super_admin only) ────────────────────────────────
  useEffect(() => {
    const fetchOrganizations = async () => {
      if (loggedInRole === "super_admin") {
        const res = await api.get("/organizations");
        setOrganizations(Array.isArray(res.data) ? res.data : []);
      }
    };
    fetchOrganizations();
  }, [loggedInRole]);

  // ── Fetch Vendors when tprm module is selected ────────────────────────────
  useEffect(() => {
    if (!isTprmSelected) {
      setVendors([]);
      return;
    }
    const fetchVendors = async () => {
      try {
        const myObj = JSON.parse(sessionStorage.getItem("user") || "{}");
        const orgId = myObj?.organization || userOrg;
        const res = await axios.get(TPRM_VENDORS_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: { organization: orgId },
        });
        const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
        setVendors(data);
        // Build id → name map so chips always show names, not raw IDs
        const map = {};
        data.forEach((v) => {
          // API may return id, _id, or vendorId — try all
          const id = v.id ?? v._id ?? v.vendorId;
          if (id) map[String(id)] = v.vendorName || v.name || String(id);
        });
        setVendorMap((prev) => ({ ...prev, ...map }));
      } catch (err) {
        console.error("Vendor fetch failed:", err.message);
      }
    };
    fetchVendors();
  }, [isTprmSelected]);

  // ── Prefill in edit mode ───────────────────────────────────────────────────
  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        password: "",
        role: normalizeArray(userToEdit.role),
        department: normalizeArray(userToEdit.department),
        organization: userToEdit.organization || "",
        modules: normalizeArray(userToEdit.modules),
        vendors: normalizeArray(userToEdit.vendors),
      });
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = (e) => {
    const { name, value } = e.target;
    const newValue = Array.isArray(value) ? value : normalizeArray(value);

    if (name === "department") {
      const isRiskOwner = formData.role.includes("risk_owner");
      if (isRiskOwner && newValue.length > 1) {
        setFormData((prev) => ({ ...prev, [name]: [newValue[newValue.length - 1]] }));
        return;
      }
    }

    setFormData((prev) => {
      let finalNewValue = [...newValue];

      if (name === "role") {
        const hasUser = finalNewValue.includes("user");
        const hasOther = finalNewValue.some((r) => r !== "user");
        const hasSpecial = finalNewValue.some((r) => ["dpo", "ciso", "aio"].includes(r));
        
        if (hasUser && hasOther) {
          if (prev.role.includes("user")) {
            finalNewValue = finalNewValue.filter((r) => r !== "user");
          } else {
            finalNewValue = ["user"];
          }
        }
        
        // Clear modules & vendors if no longer "user" or "steering_committee_member" role
        if (!finalNewValue.includes("user") && !finalNewValue.includes("steering_committee_member")) {
          return { ...prev, [name]: finalNewValue, modules: [], vendors: [] };
        }
      }

      // If modules change and tprm is removed, clear vendors
      if (name === "modules" && !finalNewValue.includes("tprm")) {
        return { ...prev, [name]: finalNewValue, vendors: [] };
      }

      // If modules change and tprm is added, clear department (backend expects empty array, not [""])
      if (name === "modules" && finalNewValue.includes("tprm")) {
        return { ...prev, [name]: finalNewValue, department: [] };
      }

      return { ...prev, [name]: finalNewValue };
    });
  };

  const handleChipDelete = (fieldName, valueToRemove) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [fieldName]: prev[fieldName].filter((v) => v !== valueToRemove),
      };
      if (fieldName === "role" && (valueToRemove === "user" || valueToRemove === "steering_committee_member")) {
        updated.modules = [];
        updated.vendors = [];
      }
      if (fieldName === "modules" && valueToRemove === "tprm") {
        updated.vendors = [];
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Enforce org user limit for root role
    if (!userToEdit && loggedInRole === "root" && userLimitInfo?.max !== null && userLimitInfo?.max !== undefined) {
      if (userLimitInfo.current >= userLimitInfo.max) {
        setError(`User limit reached. Your organisation is allowed a maximum of ${userLimitInfo.max} users (currently ${userLimitInfo.current}).`);
        setLoading(false);
        return;
      }
    }

    try {
      const rolesArr = normalizeArray(formData.role);
      const vendorsArr = normalizeArray(formData.vendors);

      const payload = {
        name: formData.name,
        email: formData.email.toLowerCase(),
        role: rolesArr,
        department:
          loggedInRole === "super_admin"
            ? []  
            : isTprmSelected
              ? []  // Send empty array when TPRM is selected
              : normalizeArray(formData.department),
        organization:
          loggedInRole === "super_admin"
            ? formData.organization
            : isTprmSelected && vendorsArr.length > 0
              ? vendorsArr[0]  // Use first vendor as organization string when TPRM selected
              : userOrg,
        // Auto-derive isAuditor from role — not user-input
        isAuditor: rolesArr.includes("auditor") || rolesArr.includes("audit_manager"),
        // Only send modules for "user" or "steering_committee_member" role
        modules: (rolesArr.includes("user") || rolesArr.includes("steering_committee_member")) ? normalizeArray(formData.modules) : [],
        // Vendors only when tprm module selected
        vendors: isTprmSelected ? vendorsArr : [],
      };

      if (!userToEdit || formData.password) {
        payload.password = formData.password;
      }

      if (userToEdit) {
        await api.post("/users/update", { ...payload, id: userToEdit.id });
        alert("User updated successfully!");
        onSuccess ? onSuccess() : history.goBack();
      } else {
        await api.post("/users/register", payload);
        alert("User created successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          role: [],
          department: [],
          organization: "",
          modules: [],
          vendors: [],
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const getDeptLabel = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.name : id;
  };

  const getVendorLabel = (id) =>
    // Check vendorMap first (persists even after vendors list clears)
    vendorMap[String(id)] || id;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Stack direction="row" spacing={1} mb={3}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => history.push("/users/list")}>
            List
          </Button>
          <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center", pr: 8 }}>
            {userToEdit ? "Edit User" : "Create User"}
          </Typography>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

        {/* User limit banner — shown for root role only when creating (not editing) */}
        {!userToEdit && loggedInRole === "root" && userLimitInfo && (
          <Alert
            severity={
              userLimitInfo.max === null
                ? "info"
                : userLimitInfo.current >= userLimitInfo.max
                ? "error"
                : userLimitInfo.current >= userLimitInfo.max * 0.8
                ? "warning"
                : "info"
            }
            sx={{ mb: 1 }}
          >
            {userLimitInfo.max === null
              ? `Users in your organisation: ${userLimitInfo.current} (no limit set)`
              : `Users: ${userLimitInfo.current} / ${userLimitInfo.max}`}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {/* Basic Info */}
            <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} required />
            <TextField
              label={userToEdit ? "New Password" : "Password"}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!userToEdit}
            />

            {/* Roles */}
            <FormControl fullWidth>
              <InputLabel>Roles</InputLabel>
              <Select
                multiple
                name="role"
                value={formData.role}
                onChange={handleMultiChange}
                input={<OutlinedInput label="Roles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((val) => (
                      <Chip key={val} label={val} size="small"
                        onDelete={() => handleChipDelete("role", val)}
                        onMouseDown={(e) => e.stopPropagation()} />
                    ))}
                  </Box>
                )}
              >
                {roles
                  .filter((r) => {
                    if (r === "user" && formData.role.some((s) => s !== "user")) return false;
                    return true;
                  })
                  .map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>

            {/* Modules — only for role=user or steering_committee_member (root only), shown BEFORE department */}
            {loggedInRole === "root" && (isUserRole || isSteeringRole) && (
              <FormControl fullWidth>
                <InputLabel>Modules</InputLabel>
                <Select
                  multiple
                  name="modules"
                  value={formData.modules}
                  onChange={handleMultiChange}
                  input={<OutlinedInput label="Modules" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((val) => (
                        <Chip key={val} label={val} size="small"
                          onDelete={() => handleChipDelete("modules", val)}
                          onMouseDown={(e) => e.stopPropagation()} />
                      ))}
                    </Box>
                  )}
                >
                  {["audit", "compliance", "policies", "risk", "tprm"].map((m) => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Vendors dropdown — only when tprm module is selected */}
            {showVendors && (
              <FormControl fullWidth>
                <InputLabel>Vendors (TPRM)</InputLabel>
                <Select
                  multiple
                  name="vendors"
                  value={formData.vendors}
                  onChange={handleMultiChange}
                  input={<OutlinedInput label="Vendors (TPRM)" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((val) => (
                        <Chip key={val} label={getVendorLabel(val)} size="small"
                          onDelete={() => handleChipDelete("vendors", val)}
                          onMouseDown={(e) => e.stopPropagation()} />
                      ))}
                    </Box>
                  )}
                >
                  {vendors.length === 0 ? (
                    <MenuItem disabled>No vendors found</MenuItem>
                  ) : (
                    vendors.map((v) => {
                      const id = v.id || v._id;
                      return (
                        <MenuItem key={id} value={id}>
                          {v.vendorName || v.name}
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
              </FormControl>
            )}

            {/* Department — shown for special roles (dpo, ciso, aio) and other conditions */}
            {showDepartment && (
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  multiple
                  name="department"
                  value={formData.department}
                  onChange={handleMultiChange}
                  input={<OutlinedInput label="Department" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((val) => (
                        <Chip key={val} label={getDeptLabel(val)} size="small"
                          onDelete={() => handleChipDelete("department", val)}
                          onMouseDown={(e) => e.stopPropagation()} />
                      ))}
                    </Box>
                  )}
                >
                  {departments.length === 0 ? (
                    <MenuItem disabled>No departments available</MenuItem>
                  ) : (
                    departments.map((d) => (
                      <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}

            {/* Organization (super_admin only) */}
            {loggedInRole === "super_admin" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>Organization</InputLabel>
                  <Select
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    input={<OutlinedInput label="Organization" />}
                    required
                  >
                    {organizations.map((org) => (
                      <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Link to="/organizations/create" style={{ textDecoration: "none" }}>
                    <Button size="small" variant="text">+ Create Organization</Button>
                  </Link>
                </Box>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {userToEdit ? "Update User" : "Create User"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}