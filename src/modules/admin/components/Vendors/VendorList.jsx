// import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";                                          // ← plain axios
// import { captureActivity, ACTIONS } from "../../../../services/activities";

// import {
//     Box,
//     Button,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TablePagination,
//     Typography,
//     IconButton,
//     Tooltip,
//     CircularProgress,
//     Alert,
//     Stack,
//     TextField,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogContentText,
//     DialogActions,
// } from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Cancel";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import StorefrontIcon from "@mui/icons-material/Storefront";

// const TPRM_BASE = "https://api.calvant.com/tprm-service/api/tprm/vendors"; // ← hardcoded

// const VendorList = () => {
//     const [vendors, setVendors] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const [searchTerm, setSearchTerm] = useState("");
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);

//     const [editingId, setEditingId] = useState(null);
//     const [editName, setEditName] = useState("");
//     const [savingId, setSavingId] = useState(null);

//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteTarget, setDeleteTarget] = useState(null);
//     const [confirmText, setConfirmText] = useState("");
//     const [deletingId, setDeletingId] = useState(null);

//     const history = useHistory();

//     // ← read from sessionStorage (admin panel)
//     const token = sessionStorage.getItem("token");
//     const myObject = JSON.parse(sessionStorage.getItem("user") || "{}");
//     const organizationId = myObject?.organization || null;

//     const decoded = token ? jwtDecode(token) : null;
//     const loggedInRole = Array.isArray(decoded?.role) ? decoded.role[0] : decoded?.role;
//     const isRoot = loggedInRole === "root";
//     const isSuperAdmin = loggedInRole === "super_admin";

//     // ← explicit headers like old working code
//     const authHeaders = {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//     };

//     // ── Fetch ──────────────────────────────────────────────────────────────────
//     const fetchVendors = async () => {
//         setLoading(true);
//         setError("");
//         try {
//             const params = isSuperAdmin ? {} : { organization: organizationId };
//             const res = await axios.get(TPRM_BASE, {
//                 headers: authHeaders,
//                 params,
//             });
//             const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
//             setVendors(data);
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to load vendors.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchVendors();
//     }, []);

//     // ── Inline Edit ────────────────────────────────────────────────────────────
//     const handleStartEdit = (vendor) => {
//         setEditingId(vendor.id || vendor._id);
//         setEditName(vendor.vendorName || vendor.name || "");
//     };

//     const handleCancelEdit = () => {
//         setEditingId(null);
//         setEditName("");
//     };

//     const handleSave = async (vendor) => {
//         if (!editName.trim()) return;
//         const id = vendor.id || vendor._id;
//         setSavingId(id);
//         try {
//             await axios.put(
//                 `${TPRM_BASE}/${id}`,
//                 { ...vendor, vendorName: editName.trim() },
//                 { headers: authHeaders }
//             );
//             setVendors((prev) =>
//                 prev.map((v) =>
//                     (v.id || v._id) === id ? { ...v, vendorName: editName.trim() } : v
//                 )
//             );
//             setSuccess(`Vendor "${editName.trim()}" updated.`);
//             captureActivity({ action: ACTIONS.UPDATE, item: [{ name: editName.trim() }] });
//             setEditingId(null);
//             setEditName("");
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to update vendor.");
//         } finally {
//             setSavingId(null);
//         }
//     };

//     // ── Delete ─────────────────────────────────────────────────────────────────
//     const handleOpenDelete = (vendor) => {
//         setDeleteTarget(vendor);
//         setConfirmText("");
//         setOpenDelete(true);
//     };

//     const handleConfirmDelete = async () => {
//         if (confirmText.trim().toLowerCase() !== "confirm") return;
//         const id = deleteTarget?.id || deleteTarget?._id;
//         setDeletingId(id);
//         try {
//             await axios.delete(`${TPRM_BASE}/${id}`, { headers: authHeaders });
//             setVendors((prev) => prev.filter((v) => (v.id || v._id) !== id));
//             setSuccess(`Vendor "${deleteTarget?.vendorName || deleteTarget?.name}" deleted.`);
//             captureActivity({ action: ACTIONS.DELETE, item: [{ name: deleteTarget?.vendorName }] });
//         } catch (err) {
//             setError(err.response?.data?.message || "Failed to delete vendor.");
//         } finally {
//             setDeletingId(null);
//             setOpenDelete(false);
//             setConfirmText("");
//             setDeleteTarget(null);
//         }
//     };

//     // ── Filter & Pagination ────────────────────────────────────────────────────
//     const filtered = vendors.filter((v) => {
//         const name = (v.vendorName || v.name || "").toLowerCase();
//         return name.includes(searchTerm.toLowerCase());
//     });

//     const visibleRows = filtered.slice(
//         page * rowsPerPage,
//         page * rowsPerPage + rowsPerPage
//     );

//     // ── Render ─────────────────────────────────────────────────────────────────
//     return (
//         <Box sx={{ p: 2 }}>
//             {/* Header */}
//             <Stack direction="row" spacing={2} mb={2} alignItems="center">
//                 <StorefrontIcon color="action" />
//                 <Typography variant="h5">Vendor Management</Typography>
//                 <Box sx={{ flexGrow: 1 }}>
//                     <TextField
//                         placeholder="Search vendors..."
//                         size="small"
//                         value={searchTerm}
//                         onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
//                     />
//                 </Box>
//                 <Tooltip title="Refresh">
//                     <IconButton onClick={fetchVendors}>
//                         <RefreshIcon />
//                     </IconButton>
//                 </Tooltip>
//                 {isRoot && (
//                     <Button
//                         variant="contained"
//                         startIcon={<AddIcon />}
//                         onClick={() => history.push("/admin/vendors/create")}
//                     >
//                         Add Vendor
//                     </Button>
//                 )}
//             </Stack>

//             {success && (
//                 <Alert severity="success" sx={{ mb: 1 }} onClose={() => setSuccess("")}>
//                     {success}
//                 </Alert>
//             )}
//             {error && (
//                 <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError("")}>
//                     {error}
//                 </Alert>
//             )}

//             {/* Table */}
//             <Paper>
//                 <TableContainer sx={{ maxHeight: "70vh" }}>
//                     <Table stickyHeader size="small">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell sx={{ fontWeight: "bold" }}>Vendor Name</TableCell>
//                                 <TableCell sx={{ fontWeight: "bold" }}>Point of Contact</TableCell>
//                                 {isRoot && (
//                                     <TableCell sx={{ fontWeight: "bold" }} align="right">
//                                         Actions
//                                     </TableCell>
//                                 )}
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {loading ? (
//                                 <TableRow>
//                                     <TableCell colSpan={isRoot ? 3 : 2} align="center">
//                                         <CircularProgress size={28} sx={{ my: 2 }} />
//                                     </TableCell>
//                                 </TableRow>
//                             ) : filtered.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={isRoot ? 3 : 2} align="center">
//                                         <Typography
//                                             variant="body2"
//                                             color="text.secondary"
//                                             sx={{ py: 3 }}
//                                         >
//                                             No vendors found.
//                                         </Typography>
//                                     </TableCell>
//                                 </TableRow>
//                             ) : (
//                                 visibleRows.map((vendor) => {
//                                     const id = vendor.id || vendor._id;
//                                     const isEditing = editingId === id;
//                                     const displayName = vendor.vendorName || vendor.name || "-";

//                                     return (
//                                         <TableRow
//                                             key={id}
//                                             sx={{
//                                                 backgroundColor: isEditing ? "#f0f7ff" : "inherit",
//                                                 "&:hover": {
//                                                     backgroundColor: isEditing
//                                                         ? "#e8f2ff"
//                                                         : "#f9fafb",
//                                                 },
//                                             }}
//                                         >
//                                             {/* Vendor Name */}
//                                             <TableCell>
//                                                 {isRoot && isEditing ? (
//                                                     <TextField
//                                                         size="small"
//                                                         value={editName}
//                                                         onChange={(e) => setEditName(e.target.value)}
//                                                         sx={{ minWidth: 180 }}
//                                                         autoFocus
//                                                     />
//                                                 ) : (
//                                                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                                         <StorefrontIcon fontSize="small" color="action" />
//                                                         <Typography variant="subtitle2">
//                                                             {displayName}
//                                                         </Typography>
//                                                     </Box>
//                                                 )}
//                                             </TableCell>

//                                             {/* Point of Contact */}
//                                             <TableCell>
//                                                 <Typography variant="body2" color="text.secondary">
//                                                     {vendor.poc || "-"}
//                                                 </Typography>
//                                             </TableCell>

//                                             {/* Actions — root only */}
//                                             {isRoot && (
//                                                 <TableCell align="right">
//                                                     {isEditing ? (
//                                                         <Stack
//                                                             direction="row"
//                                                             spacing={1}
//                                                             justifyContent="flex-end"
//                                                         >
//                                                             <Button
//                                                                 size="small"
//                                                                 variant="contained"
//                                                                 startIcon={
//                                                                     savingId === id ? (
//                                                                         <CircularProgress size={14} color="inherit" />
//                                                                     ) : (
//                                                                         <SaveIcon />
//                                                                     )
//                                                                 }
//                                                                 disabled={savingId === id}
//                                                                 onClick={() => handleSave(vendor)}
//                                                             >
//                                                                 {savingId === id ? "Saving..." : "Save"}
//                                                             </Button>
//                                                             <Button
//                                                                 size="small"
//                                                                 variant="outlined"
//                                                                 startIcon={<CancelIcon />}
//                                                                 onClick={handleCancelEdit}
//                                                             >
//                                                                 Cancel
//                                                             </Button>
//                                                         </Stack>
//                                                     ) : (
//                                                         <Stack
//                                                             direction="row"
//                                                             spacing={0.5}
//                                                             justifyContent="flex-end"
//                                                         >
//                                                             <Tooltip title="Edit vendor">
//                                                                 <IconButton
//                                                                     color="primary"
//                                                                     size="small"
//                                                                     onClick={() => handleStartEdit(vendor)}
//                                                                 >
//                                                                     <EditIcon fontSize="small" />
//                                                                 </IconButton>
//                                                             </Tooltip>
//                                                             <Tooltip title="Delete vendor">
//                                                                 <IconButton
//                                                                     color="error"
//                                                                     size="small"
//                                                                     onClick={() => handleOpenDelete(vendor)}
//                                                                     disabled={deletingId === id}
//                                                                 >
//                                                                     <DeleteIcon fontSize="small" />
//                                                                 </IconButton>
//                                                             </Tooltip>
//                                                         </Stack>
//                                                     )}
//                                                 </TableCell>
//                                             )}
//                                         </TableRow>
//                                     );
//                                 })
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//                 <TablePagination
//                     component="div"
//                     count={filtered.length}
//                     page={page}
//                     rowsPerPage={rowsPerPage}
//                     onPageChange={(e, p) => setPage(p)}
//                     onRowsPerPageChange={(e) => {
//                         setRowsPerPage(+e.target.value);
//                         setPage(0);
//                     }}
//                 />
//             </Paper>

//             {/* Delete Confirmation Dialog */}
//             <Dialog
//                 open={openDelete}
//                 onClose={() => { setOpenDelete(false); setConfirmText(""); }}
//             >
//                 <DialogTitle>Confirm Delete</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText sx={{ mb: 2 }}>
//                         Are you sure you want to delete{" "}
//                         <strong>{deleteTarget?.vendorName || deleteTarget?.name}</strong>?
//                         This action <strong>cannot be undone</strong>.
//                     </DialogContentText>
//                     <DialogContentText sx={{ mb: 1 }}>
//                         Type <strong>confirm</strong> to proceed:
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         fullWidth
//                         size="small"
//                         placeholder="confirm"
//                         value={confirmText}
//                         onChange={(e) => setConfirmText(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && handleConfirmDelete()}
//                         error={
//                             confirmText.length > 0 &&
//                             confirmText.trim().toLowerCase() !== "confirm"
//                         }
//                         helperText={
//                             confirmText.length > 0 &&
//                             confirmText.trim().toLowerCase() !== "confirm"
//                                 ? 'Please type "confirm" exactly'
//                                 : ""
//                         }
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         onClick={() => { setOpenDelete(false); setConfirmText(""); }}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         color="error"
//                         variant="contained"
//                         disabled={
//                             confirmText.trim().toLowerCase() !== "confirm" || !!deletingId
//                         }
//                         onClick={handleConfirmDelete}
//                     >
//                         {deletingId ? "Deleting..." : "Delete"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default VendorList;

import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { captureActivity, ACTIONS } from "../../../../services/activities";

import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Stack,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Chip,
    InputAdornment,
    Collapse,
    Avatar,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const TPRM_BASE = "https://api.calvant.com/tprm-service/api/tprm/vendors";

// ── Helpers ────────────────────────────────────────────────────────────────────
const getVendorInitials = (name = "") =>
    name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

const avatarColor = (name = "") => {
    const palette = [
        { bg: "#E6F1FB", color: "#185FA5" },
        { bg: "#EAF3DE", color: "#3B6D11" },
        { bg: "#FAEEDA", color: "#854F0B" },
        { bg: "#EEEDFE", color: "#3C3489" },
        { bg: "#E1F5EE", color: "#085041" },
        { bg: "#FBEAF0", color: "#72243E" },
    ];
    const idx =
        name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
        palette.length;
    return palette[idx];
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = {
    page: {
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
        bgcolor: "#F8F9FB",
    },
    headerRow: {
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 2.5,
        flexWrap: "wrap",
    },
    titleGroup: {
        display: "flex",
        alignItems: "center",
        gap: 1,
    },
    paper: {
        borderRadius: "12px",
        border: "1px solid #E8EAF0",
        boxShadow: "0 1px 4px 0 rgba(16,24,40,0.06)",
        overflow: "hidden",
    },
    thead: {
        "& th": {
            bgcolor: "#F4F5F7",
            color: "#6B7280",
            fontWeight: 600,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            borderBottom: "1px solid #E8EAF0",
            py: 1.5,
            px: 2,
        },
    },
    row: {
        transition: "background 0.12s",
        "&:hover": { bgcolor: "#F8F9FB" },
        "&:last-child td": { borderBottom: "none" },
        "& td": {
            borderBottom: "1px solid #F0F1F4",
            py: 1.25,
            px: 2,
        },
    },
    editingRow: {
        bgcolor: "#EEF5FF !important",
        "& td": { borderBottom: "1px solid #D0E4FF" },
    },
    vendorName: {
        fontWeight: 600,
        fontSize: "13.5px",
        color: "#111827",
        lineHeight: 1.3,
    },
    pocText: {
        fontSize: "12px",
        color: "#6B7280",
    },
    addBtn: {
        borderRadius: "8px",
        textTransform: "none",
        fontWeight: 600,
        fontSize: "13px",
        px: 2,
        py: 0.9,
        bgcolor: "#185FA5",
        "&:hover": { bgcolor: "#0C447C" },
        boxShadow: "none",
    },
    refreshBtn: {
        border: "1px solid #E8EAF0",
        borderRadius: "8px",
        color: "#6B7280",
        "&:hover": { bgcolor: "#F4F5F7", borderColor: "#D1D5DB" },
    },
    editBtn: {
        border: "1px solid #E8EAF0",
        borderRadius: "6px",
        color: "#6B7280",
        fontSize: "12px",
        px: 1.25,
        py: 0.5,
        textTransform: "none",
        fontWeight: 500,
        "&:hover": { bgcolor: "#F4F5F7", borderColor: "#D1D5DB" },
    },
    deleteBtn: {
        border: "1px solid #FECACA",
        borderRadius: "6px",
        color: "#DC2626",
        fontSize: "12px",
        px: 1,
        py: 0.5,
        minWidth: 0,
        "&:hover": { bgcolor: "#FEF2F2", borderColor: "#F87171" },
    },
    saveBtn: {
        borderRadius: "6px",
        textTransform: "none",
        fontWeight: 600,
        fontSize: "12px",
        px: 1.5,
        py: 0.6,
        bgcolor: "#185FA5",
        "&:hover": { bgcolor: "#0C447C" },
        boxShadow: "none",
    },
    cancelBtn: {
        borderRadius: "6px",
        textTransform: "none",
        fontWeight: 500,
        fontSize: "12px",
        px: 1.25,
        py: 0.6,
        border: "1px solid #E8EAF0",
        color: "#6B7280",
        "&:hover": { bgcolor: "#F4F5F7" },
    },
    searchInput: {
        "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontSize: "13px",
            bgcolor: "#fff",
            height: "38px",
            "& fieldset": { borderColor: "#E8EAF0" },
            "&:hover fieldset": { borderColor: "#C4C9D4" },
            "&.Mui-focused fieldset": { borderColor: "#185FA5", borderWidth: "1.5px" },
        },
    },
    editInput: {
        "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            fontSize: "13px",
            height: "34px",
            "&.Mui-focused fieldset": { borderColor: "#185FA5", borderWidth: "1.5px" },
        },
    },
    dialogDeleteBtn: {
        borderRadius: "8px",
        textTransform: "none",
        fontWeight: 600,
        fontSize: "13px",
        px: 2.5,
        bgcolor: "#DC2626",
        "&:hover": { bgcolor: "#B91C1C" },
        boxShadow: "none",
    },
    dialogCancelBtn: {
        borderRadius: "8px",
        textTransform: "none",
        fontWeight: 500,
        fontSize: "13px",
        px: 2,
        border: "1px solid #E8EAF0",
        color: "#374151",
        "&:hover": { bgcolor: "#F4F5F7" },
    },
};

// ── Component ──────────────────────────────────────────────────────────────────
const VendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [savingId, setSavingId] = useState(null);

    const [openDelete, setOpenDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [confirmText, setConfirmText] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const history = useHistory();

    const token = sessionStorage.getItem("token");
    const myObject = JSON.parse(sessionStorage.getItem("user") || "{}");
    const organizationId = myObject?.organization || null;

    const decoded = token ? jwtDecode(token) : null;
    const loggedInRole = Array.isArray(decoded?.role) ? decoded.role[0] : decoded?.role;
    const isRoot = loggedInRole === "root";
    const isSuperAdmin = loggedInRole === "super_admin";

    const authHeaders = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchVendors = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = isSuperAdmin ? {} : { organization: organizationId };
            const res = await axios.get(TPRM_BASE, { headers: authHeaders, params });
            const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
            setVendors(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load vendors.");
        } finally {
            setLoading(false);
        }
    }, [organizationId, isSuperAdmin]);

    useEffect(() => { fetchVendors(); }, [fetchVendors]);

    // Auto-dismiss alerts
    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(""), 4000);
        return () => clearTimeout(t);
    }, [success]);

    // ── Edit ───────────────────────────────────────────────────────────────────
    const handleStartEdit = (vendor) => {
        setEditingId(vendor.id || vendor._id);
        setEditName(vendor.vendorName || vendor.name || "");
    };
    const handleCancelEdit = () => { setEditingId(null); setEditName(""); };
    const handleSave = async (vendor) => {
        if (!editName.trim()) return;
        const id = vendor.id || vendor._id;
        setSavingId(id);
        try {
            await axios.put(`${TPRM_BASE}/${id}`, { ...vendor, vendorName: editName.trim() }, { headers: authHeaders });
            setVendors((prev) => prev.map((v) => (v.id || v._id) === id ? { ...v, vendorName: editName.trim() } : v));
            setSuccess(`Vendor "${editName.trim()}" updated.`);
            captureActivity({ action: ACTIONS.UPDATE, item: [{ name: editName.trim() }] });
            setEditingId(null);
            setEditName("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update vendor.");
        } finally {
            setSavingId(null);
        }
    };

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleOpenDelete = (vendor) => { setDeleteTarget(vendor); setConfirmText(""); setOpenDelete(true); };
    const handleConfirmDelete = async () => {
        if (confirmText.trim().toLowerCase() !== "confirm") return;
        const id = deleteTarget?.id || deleteTarget?._id;
        setDeletingId(id);
        try {
            await axios.delete(`${TPRM_BASE}/${id}`, { headers: authHeaders });
            setVendors((prev) => prev.filter((v) => (v.id || v._id) !== id));
            setSuccess(`Vendor "${deleteTarget?.vendorName || deleteTarget?.name}" deleted.`);
            captureActivity({ action: ACTIONS.DELETE, item: [{ name: deleteTarget?.vendorName }] });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete vendor.");
        } finally {
            setDeletingId(null);
            setOpenDelete(false);
            setConfirmText("");
            setDeleteTarget(null);
        }
    };

    // ── Filtered + paginated data ──────────────────────────────────────────────
    const filtered = vendors.filter((v) =>
        (v.vendorName || v.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    const visibleRows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const vendorDisplayName = (v) => v.vendorName || v.name || "—";

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <Box sx={styles.page}>

            {/* ── Header ── */}
            <Box sx={styles.headerRow}>
                <Box sx={styles.titleGroup}>
                    <StorefrontIcon sx={{ color: "#185FA5", fontSize: 22 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: "18px", color: "#111827" }}>
                        Vendor Management
                    </Typography>
                    {!loading && (
                        <Chip
                            label={`${filtered.length} vendor${filtered.length !== 1 ? "s" : ""}`}
                            size="small"
                            sx={{
                                bgcolor: "#EEF2FF",
                                color: "#3730A3",
                                fontWeight: 600,
                                fontSize: "11px",
                                height: 22,
                                borderRadius: "6px",
                            }}
                        />
                    )}
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <TextField
                    placeholder="Search vendors..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                    sx={{ ...styles.searchInput, width: 220 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 17, color: "#9CA3AF" }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <Tooltip title="Refresh list">
                    <IconButton onClick={fetchVendors} sx={styles.refreshBtn} size="small">
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                {isRoot && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => history.push("/admin/vendors/create")}
                        sx={styles.addBtn}
                    >
                        Add Vendor
                    </Button>
                )}
            </Box>

            {/* ── Alerts ── */}
            <Collapse in={!!success}>
                <Alert
                    severity="success"
                    onClose={() => setSuccess("")}
                    sx={{ mb: 1.5, borderRadius: "8px", fontSize: "13px" }}
                >
                    {success}
                </Alert>
            </Collapse>
            <Collapse in={!!error}>
                <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{ mb: 1.5, borderRadius: "8px", fontSize: "13px" }}
                >
                    {error}
                </Alert>
            </Collapse>

            {/* ── Table ── */}
            <Paper elevation={0} sx={styles.paper}>
                <TableContainer sx={{ maxHeight: "68vh" }}>
                    <Table stickyHeader size="small">
                        <TableHead sx={styles.thead}>
                            <TableRow>
                                <TableCell>Vendor</TableCell>
                                <TableCell>Point of Contact</TableCell>
                                {isRoot && <TableCell align="right">Actions</TableCell>}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={isRoot ? 3 : 2} align="center" sx={{ py: 6 }}>
                                        <CircularProgress size={26} thickness={4} sx={{ color: "#185FA5" }} />
                                        <Typography sx={{ mt: 1, fontSize: "13px", color: "#9CA3AF" }}>
                                            Loading vendors...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isRoot ? 3 : 2} align="center" sx={{ py: 7 }}>
                                        <StorefrontIcon sx={{ fontSize: 36, color: "#E5E7EB", mb: 1 }} />
                                        <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                                            No vendors found
                                        </Typography>
                                        <Typography sx={{ fontSize: "12px", color: "#9CA3AF", mt: 0.5 }}>
                                            {searchTerm ? "Try a different search term." : "Add your first vendor to get started."}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                visibleRows.map((vendor) => {
                                    const id = vendor.id || vendor._id;
                                    const isEditing = editingId === id;
                                    const name = vendorDisplayName(vendor);
                                    const { bg, color } = avatarColor(name);

                                    return (
                                        <TableRow
                                            key={id}
                                            sx={{ ...styles.row, ...(isEditing ? styles.editingRow : {}) }}
                                        >
                                            {/* Vendor */}
                                            <TableCell>
                                                {isRoot && isEditing ? (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Avatar sx={{ width: 32, height: 32, bgcolor: bg, color, fontSize: "11px", fontWeight: 700, borderRadius: "8px" }}>
                                                            {getVendorInitials(editName || name)}
                                                        </Avatar>
                                                        <TextField
                                                            size="small"
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            onKeyDown={(e) => e.key === "Enter" && handleSave(vendor)}
                                                            sx={{ ...styles.editInput, minWidth: 180 }}
                                                            autoFocus
                                                        />
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                                        <Avatar sx={{ width: 32, height: 32, bgcolor: bg, color, fontSize: "11px", fontWeight: 700, borderRadius: "8px" }}>
                                                            {getVendorInitials(name)}
                                                        </Avatar>
                                                        <Typography sx={styles.vendorName}>{name}</Typography>
                                                    </Box>
                                                )}
                                            </TableCell>

                                            {/* POC */}
                                            <TableCell>
                                                <Typography sx={styles.pocText}>
                                                    {vendor.poc || "—"}
                                                </Typography>
                                            </TableCell>

                                            {/* Actions */}
                                            {isRoot && (
                                                <TableCell align="right">
                                                    {isEditing ? (
                                                        <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                startIcon={savingId === id ? <CircularProgress size={12} color="inherit" /> : <SaveIcon sx={{ fontSize: "14px !important" }} />}
                                                                disabled={savingId === id || !editName.trim()}
                                                                onClick={() => handleSave(vendor)}
                                                                sx={styles.saveBtn}
                                                            >
                                                                {savingId === id ? "Saving..." : "Save"}
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                startIcon={<CancelIcon sx={{ fontSize: "14px !important" }} />}
                                                                onClick={handleCancelEdit}
                                                                sx={styles.cancelBtn}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </Stack>
                                                    ) : (
                                                        <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                                                            <Tooltip title="Edit vendor" placement="top">
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    startIcon={<EditIcon sx={{ fontSize: "13px !important" }} />}
                                                                    onClick={() => handleStartEdit(vendor)}
                                                                    sx={styles.editBtn}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip title="Delete vendor" placement="top">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleOpenDelete(vendor)}
                                                                    disabled={deletingId === id}
                                                                    sx={styles.deleteBtn}
                                                                >
                                                                    {deletingId === id
                                                                        ? <CircularProgress size={13} color="inherit" />
                                                                        : <DeleteIcon sx={{ fontSize: 15 }} />}
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filtered.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(_, p) => setPage(p)}
                    onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
                    sx={{
                        borderTop: "1px solid #F0F1F4",
                        fontSize: "12px",
                        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                            fontSize: "12px",
                            color: "#6B7280",
                        },
                    }}
                />
            </Paper>

            {/* ── Delete Dialog ── */}
            <Dialog
                open={openDelete}
                onClose={() => { setOpenDelete(false); setConfirmText(""); }}
                PaperProps={{
                    sx: {
                        borderRadius: "12px",
                        border: "1px solid #F0F1F4",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                        p: 0.5,
                        maxWidth: 380,
                    },
                }}
            >
                {/* Warning icon header */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, pt: 2.5, pb: 1 }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: "10px",
                        bgcolor: "#FEF2F2", display: "flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                        <WarningAmberIcon sx={{ color: "#DC2626", fontSize: 20 }} />
                    </Box>
                    <DialogTitle sx={{ p: 0, fontWeight: 700, fontSize: "16px", color: "#111827" }}>
                        Delete vendor
                    </DialogTitle>
                </Box>

                <DialogContent sx={{ px: 3, pt: 0.5, pb: 2 }}>
                    <DialogContentText sx={{ fontSize: "13px", color: "#6B7280", mb: 2, lineHeight: 1.65 }}>
                        You're about to permanently delete{" "}
                        <Box component="span" sx={{ fontWeight: 600, color: "#111827" }}>
                            {deleteTarget?.vendorName || deleteTarget?.name}
                        </Box>
                        . This action cannot be undone.
                    </DialogContentText>

                    <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#374151", mb: 0.75 }}>
                        Type <Box component="span" sx={{ fontFamily: "monospace", bgcolor: "#F3F4F6", px: 0.75, py: 0.25, borderRadius: "4px" }}>confirm</Box> to proceed
                    </Typography>
                    <TextField
                        fullWidth
                        autoFocus
                        size="small"
                        placeholder="confirm"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleConfirmDelete()}
                        error={confirmText.length > 0 && confirmText.trim().toLowerCase() !== "confirm"}
                        helperText={
                            confirmText.length > 0 && confirmText.trim().toLowerCase() !== "confirm"
                                ? 'Please type "confirm" exactly'
                                : ""
                        }
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                fontSize: "13px",
                                "&.Mui-focused fieldset": { borderColor: "#DC2626" },
                            },
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
                    <Button
                        onClick={() => { setOpenDelete(false); setConfirmText(""); }}
                        sx={styles.dialogCancelBtn}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        disabled={confirmText.trim().toLowerCase() !== "confirm" || !!deletingId}
                        onClick={handleConfirmDelete}
                        startIcon={deletingId ? <CircularProgress size={14} color="inherit" /> : <DeleteIcon sx={{ fontSize: "15px !important" }} />}
                        sx={styles.dialogDeleteBtn}
                    >
                        {deletingId ? "Deleting..." : "Delete vendor"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VendorList;