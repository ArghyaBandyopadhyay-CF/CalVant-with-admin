// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box, Typography, Button, TextField, Chip, Paper, Tab, Tabs,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   IconButton, CircularProgress, Alert, Snackbar, Divider, Tooltip,
//   Dialog, DialogTitle, DialogContent, DialogActions, Switch,
//   FormControlLabel, LinearProgress, Badge
// } from "@mui/material";
// import {
//   CloudUpload, Delete, Add, Publish, Unpublished, CheckCircle,
//   Language, Policy, Business, Shield, Domain, VerifiedUser,
//   ContentCopy, Download, Edit, SaveAlt, Lock
// } from "@mui/icons-material";
// import * as api from "../../api/adminTrustCentreApi";
// import TrustCentreAccessTab from "./TrustCentreAccessTab";

// // ── Palette & style constants ─────────────────────────────────────────────────
// const ACCENT = "#0f62fe";
// const SUCCESS = "#24a148";
// const DANGER = "#da1e28";
// const SURFACE = "#f4f4f4";
// const CARD_BG = "#ffffff";

// function TabPanel({ children, value, index }) {
//   return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
// }

// // ── Reusable section card ─────────────────────────────────────────────────────
// function SectionCard({ title, icon, children, action }) {
//   return (
//     <Paper elevation={0} sx={{
//       border: "1px solid #e0e0e0", borderRadius: 2, mb: 3, overflow: "hidden"
//     }}>
//       <Box sx={{
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         px: 3, py: 2, borderBottom: "1px solid #e0e0e0", bgcolor: SURFACE
//       }}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//           {icon}
//           <Typography fontWeight={600} fontSize={15}>{title}</Typography>
//         </Box>
//         {action}
//       </Box>
//       <Box sx={{ p: 3 }}>{children}</Box>
//     </Paper>
//   );
// }

// export default function TrustCentreAdmin() {
//   const [tab, setTab] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [tc, setTc] = useState(null);
//   const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

//   // Form state
//   const [form, setForm] = useState({
//     companyName: "", foundedYear: "", domain: "", overview: "",
//     privacyPolicyLink: "", tosLink: "", compliances: []
//   });
//   const [complianceInput, setComplianceInput] = useState("");

//   // Logo
//   const [logoFile, setLogoFile] = useState(null);
//   const [logoPreview, setLogoPreview] = useState(null);
//   const logoInputRef = useRef();

//   // Trusted by
//   const [trustedByName, setTrustedByName] = useState("");
//   const [trustedByIcon, setTrustedByIcon] = useState(null);
//   const [addingTrustedBy, setAddingTrustedBy] = useState(false);
//   const trustedByIconRef = useRef();

//   // Policies
//   const [policyName, setPolicyName] = useState("");
//   const [policyFile, setPolicyFile] = useState(null);
//   const [uploadingPolicy, setUploadingPolicy] = useState(false);
//   const policyFileRef = useRef();

//   // Sub-processors
//   const [spDialog, setSpDialog] = useState(false);
//   const [spForm, setSpForm] = useState({ name: "", purpose: "", location: "", website: "" });
//   const [addingSp, setAddingSp] = useState(false);

//   // Custom domain
//   const [domainInput, setDomainInput] = useState("");
//   const [domainResult, setDomainResult] = useState(null);
//   const [verifyingDomain, setVerifyingDomain] = useState(false);

//   // Access Control — pending request badge count
//   const [pendingCount, setPendingCount] = useState(0);

//   // ── Load data ───────────────────────────────────────────────────────────────
//   const load = async () => {
//     setLoading(true);
//     try {
//       const data = await api.getTrustCentre();
//       if (data && !data.error) {
//         setTc(data);
//         setForm({
//           companyName: data.companyName || "",
//           foundedYear: data.foundedYear || "",
//           domain: data.domain || "",
//           overview: data.overview || "",
//           privacyPolicyLink: data.privacyPolicyLink || "",
//           tosLink: data.tosLink || "",
//           compliances: data.compliances || [],
//         });
//         if (data.organization) {
//           setLogoPreview(api.getLogoUrl(data.organization));
//         }
//       }

//       // Fetch pending access request count for the badge
//       try {
//         const pending = await api.listAccessRequests("PENDING");
//         setPendingCount(Array.isArray(pending) ? pending.length : 0);
//       } catch (_) {
//         // Non-critical — badge just shows 0
//       }
//     } catch (e) {
//       // First time — no record yet, that's fine
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load(); }, []);

//   const toast = (msg, severity = "success") =>
//     setSnack({ open: true, msg, severity });

//   // ── Save metadata ───────────────────────────────────────────────────────────
//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const result = await api.upsertTrustCentre(form);
//       setTc(result);
//       toast("Trust Centre saved successfully.");
//     } catch (e) {
//       toast("Failed to save.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Publish / Unpublish ─────────────────────────────────────────────────────
//   const handlePublish = async () => {
//     setSaving(true);
//     try {
//       const result = await api.publishTrustCentre();
//       setTc((prev) => ({ ...prev, ...result, publishStatus: "PUBLISHED" }));
//       toast("Trust Centre is now LIVE for all org users! 🚀");
//     } catch (e) {
//       toast("Publish failed.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleUnpublish = async () => {
//     setSaving(true);
//     try {
//       await api.unpublishTrustCentre();
//       setTc((prev) => ({ ...prev, publishStatus: "DRAFT" }));
//       toast("Trust Centre reverted to DRAFT.");
//     } catch (e) {
//       toast("Unpublish failed.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Logo ────────────────────────────────────────────────────────────────────
//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setLogoFile(file);
//     setLogoPreview(URL.createObjectURL(file));
//   };

//   const handleLogoUpload = async () => {
//     if (!logoFile) return;
//     setSaving(true);
//     try {
//       await api.uploadLogo(logoFile);
//       setLogoFile(null);
//       toast("Logo uploaded successfully.");
//     } catch (e) {
//       toast("Logo upload failed.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Compliances ─────────────────────────────────────────────────────────────
//   const addCompliance = () => {
//     const v = complianceInput.trim().toUpperCase();
//     if (v && !form.compliances.includes(v)) {
//       setForm((f) => ({ ...f, compliances: [...f.compliances, v] }));
//     }
//     setComplianceInput("");
//   };

//   const removeCompliance = (c) =>
//     setForm((f) => ({ ...f, compliances: f.compliances.filter((x) => x !== c) }));

//   // ── Trusted By ──────────────────────────────────────────────────────────────
//   const handleAddTrustedBy = async () => {
//     if (!trustedByName.trim()) return;
//     setAddingTrustedBy(true);
//     try {
//       const result = await api.addTrustedBy(trustedByName.trim(), trustedByIcon);
//       setTc(result);
//       setTrustedByName("");
//       setTrustedByIcon(null);
//       toast("Trusted-by entry added.");
//     } catch (e) {
//       toast("Failed to add.", "error");
//     } finally {
//       setAddingTrustedBy(false);
//     }
//   };

//   const handleRemoveTrustedBy = async (name) => {
//     try {
//       const result = await api.removeTrustedBy(name);
//       setTc(result);
//       toast(`Removed "${name}".`);
//     } catch (e) {
//       toast("Remove failed.", "error");
//     }
//   };

//   // ── Policies ────────────────────────────────────────────────────────────────
//   const handleUploadPolicy = async () => {
//     if (!policyName.trim() || !policyFile) return;
//     setUploadingPolicy(true);
//     try {
//       await api.uploadPolicy(policyName.trim(), policyFile);
//       setPolicyName("");
//       setPolicyFile(null);
//       await load();
//       toast(`Policy "${policyName}" uploaded.`);
//     } catch (e) {
//       toast("Policy upload failed.", "error");
//     } finally {
//       setUploadingPolicy(false);
//     }
//   };

//   const handleDownloadPolicy = async (name) => {
//     try {
//       const blob = await api.downloadPolicy(name, tc.organization);
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = name;
//       a.click();
//     } catch (e) {
//       toast("Download failed.", "error");
//     }
//   };

//   const handleRemovePolicy = async (name) => {
//     try {
//       await api.removePolicy(name);
//       await load();
//       toast(`Policy "${name}" deleted.`);
//     } catch (e) {
//       toast("Delete failed.", "error");
//     }
//   };

//   // ── Sub-Processors ──────────────────────────────────────────────────────────
//   const handleAddSp = async () => {
//     if (!spForm.name.trim()) return;
//     setAddingSp(true);
//     try {
//       const result = await api.addSubProcessor(spForm);
//       setTc(result);
//       setSpForm({ name: "", purpose: "", location: "", website: "" });
//       setSpDialog(false);
//       toast("Sub-processor added.");
//     } catch (e) {
//       toast("Failed to add sub-processor.", "error");
//     } finally {
//       setAddingSp(false);
//     }
//   };

//   const handleRemoveSp = async (name) => {
//     try {
//       await api.removeSubProcessor(name);
//       await load();
//       toast(`Sub-processor "${name}" removed.`);
//     } catch (e) {
//       toast("Remove failed.", "error");
//     }
//   };

//   // ── Custom Domain ───────────────────────────────────────────────────────────
//   const handleSetDomain = async () => {
//     if (!domainInput.trim()) return;
//     setSaving(true);
//     try {
//       const result = await api.setCustomDomain(domainInput.trim());
//       setDomainResult(result);
//       setTc((prev) => ({ ...prev, customDomain: result.customDomain, customDomainVerified: false }));
//       toast("Domain configured. Add the DNS TXT record shown below.");
//     } catch (e) {
//       toast(e.message || "Failed.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleVerifyDomain = async () => {
//     setVerifyingDomain(true);
//     try {
//       const result = await api.verifyCustomDomain();
//       setTc((prev) => ({ ...prev, customDomainVerified: true }));
//       setDomainResult(null);
//       toast("Domain verified! ✅ " + result.message);
//     } catch (e) {
//       toast("Verification failed. Check DNS propagation and retry.", "error");
//     } finally {
//       setVerifyingDomain(false);
//     }
//   };

//   const handleRemoveDomain = async () => {
//     try {
//       await api.removeCustomDomain();
//       setTc((prev) => ({ ...prev, customDomain: null, customDomainVerified: false }));
//       setDomainResult(null);
//       setDomainInput("");
//       toast("Custom domain removed.");
//     } catch (e) {
//       toast("Remove failed.", "error");
//     }
//   };

//   // ── Render ──────────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <Box sx={{ p: 6, textAlign: "center" }}>
//         <CircularProgress sx={{ color: ACCENT }} />
//         <Typography mt={2} color="text.secondary">Loading Trust Centre…</Typography>
//       </Box>
//     );
//   }

//   const isPublished = tc?.publishStatus === "PUBLISHED";

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, margin: "0 auto" }}>

//       {/* ── Header ─────────────────────────────────────────────────────────── */}
//       <Box sx={{
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         mb: 4, flexWrap: "wrap", gap: 2
//       }}>
//         <Box>
//           <Typography variant="h5" fontWeight={700} letterSpacing={-0.5}>
//             Trust Centre
//           </Typography>
//           <Typography variant="body2" color="text.secondary" mt={0.5}>
//             Manage your organisation's public trust profile
//           </Typography>
//         </Box>

//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           {/* Status badge */}
//           <Chip
//             label={isPublished ? "PUBLISHED" : "DRAFT"}
//             size="small"
//             sx={{
//               fontWeight: 700, fontSize: 11, letterSpacing: 0.5,
//               bgcolor: isPublished ? "#d9f2e6" : "#fff3cd",
//               color: isPublished ? SUCCESS : "#856404",
//               border: `1px solid ${isPublished ? "#a3d9b8" : "#ffc107"}`
//             }}
//           />

//           {isPublished ? (
//             <Button
//               variant="outlined" size="small" startIcon={<Unpublished />}
//               onClick={handleUnpublish} disabled={saving}
//               sx={{
//                 borderColor: DANGER, color: DANGER,
//                 "&:hover": { bgcolor: "#fff5f5", borderColor: DANGER }
//               }}
//             >
//               Unpublish
//             </Button>
//           ) : (
//             <Button
//               variant="contained" size="small" startIcon={<Publish />}
//               onClick={handlePublish} disabled={saving}
//               sx={{ bgcolor: ACCENT, "&:hover": { bgcolor: "#0353e9" } }}
//             >
//               Publish
//             </Button>
//           )}
//         </Box>
//       </Box>

//       {/* ── Tabs ───────────────────────────────────────────────────────────── */}
//       <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden" }}>
//         <Tabs
//           value={tab}
//           onChange={(_, v) => setTab(v)}
//           sx={{
//             borderBottom: "1px solid #e0e0e0",
//             bgcolor: SURFACE,
//             "& .MuiTab-root": { fontSize: 13, fontWeight: 600, textTransform: "none", minWidth: 120 },
//             "& .Mui-selected": { color: ACCENT },
//             "& .MuiTabs-indicator": { bgcolor: ACCENT }
//           }}
//         >
//           <Tab icon={<Business fontSize="small" />} iconPosition="start" label="General" />
//           <Tab icon={<Shield fontSize="small" />} iconPosition="start" label="Trusted By" />
//           <Tab icon={<Policy fontSize="small" />} iconPosition="start" label="Policies" />
//           <Tab icon={<Language fontSize="small" />} iconPosition="start" label="Sub-Processors" />
//           <Tab icon={<Domain fontSize="small" />} iconPosition="start" label="Custom Domain" />
//           <Tab
//             iconPosition="start"
//             label="Access Control"
//             icon={
//               <Badge badgeContent={pendingCount} color="error" max={9}>
//                 <Lock fontSize="small" />
//               </Badge>
//             }
//           />
//         </Tabs>

//         <Box sx={{ p: 3 }}>

//           {/* ══ Tab 0: General ═══════════════════════════════════════════════ */}
//           <TabPanel value={tab} index={0}>

//             {/* Logo */}
//             <SectionCard title="Company Logo" icon={<Business sx={{ color: ACCENT, fontSize: 20 }} />}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
//                 <Box sx={{
//                   width: 96, height: 96, borderRadius: 2, border: "1px dashed #bdbdbd",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   overflow: "hidden", bgcolor: SURFACE, cursor: "pointer", flexShrink: 0
//                 }} onClick={() => logoInputRef.current.click()}>
//                   {logoPreview ? (
//                     <img src={logoPreview} alt="logo"
//                       style={{ width: "100%", height: "100%", objectFit: "contain" }}
//                       onError={() => setLogoPreview(null)} />
//                   ) : (
//                     <CloudUpload sx={{ color: "#bdbdbd", fontSize: 32 }} />
//                   )}
//                 </Box>
//                 <input type="file" accept="image/*" ref={logoInputRef}
//                   style={{ display: "none" }} onChange={handleLogoChange} />
//                 <Box>
//                   <Button variant="outlined" size="small" startIcon={<CloudUpload />}
//                     onClick={() => logoInputRef.current.click()}
//                     sx={{ mr: 1, mb: 1, borderColor: ACCENT, color: ACCENT }}>
//                     Choose Logo
//                   </Button>
//                   {logoFile && (
//                     <Button variant="contained" size="small" startIcon={<SaveAlt />}
//                       onClick={handleLogoUpload} disabled={saving}
//                       sx={{ bgcolor: ACCENT, mb: 1 }}>
//                       Upload
//                     </Button>
//                   )}
//                   <Typography variant="caption" display="block" color="text.secondary">
//                     PNG recommended · Max 2MB
//                   </Typography>
//                   {logoFile && (
//                     <Typography variant="caption" color={ACCENT}>
//                       Selected: {logoFile.name}
//                     </Typography>
//                   )}
//                 </Box>
//               </Box>
//             </SectionCard>

//             {/* Basic info */}
//             <SectionCard title="Company Information" icon={<Business sx={{ color: ACCENT, fontSize: 20 }} />}>
//               <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
//                 <TextField label="Company Name" size="small" fullWidth
//                   value={form.companyName}
//                   onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} />
//                 <TextField label="Founded Year" size="small" fullWidth
//                   value={form.foundedYear}
//                   onChange={(e) => setForm((f) => ({ ...f, foundedYear: e.target.value }))} />
//                 <TextField label="Website Domain" size="small" fullWidth
//                   placeholder="acme.com"
//                   value={form.domain}
//                   onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))} />
//                 <TextField label="Privacy Policy URL" size="small" fullWidth
//                   value={form.privacyPolicyLink}
//                   onChange={(e) => setForm((f) => ({ ...f, privacyPolicyLink: e.target.value }))} />
//                 <TextField label="Terms of Service URL" size="small" fullWidth
//                   value={form.tosLink}
//                   onChange={(e) => setForm((f) => ({ ...f, tosLink: e.target.value }))} />
//               </Box>
//               <TextField label="Overview" multiline rows={4} fullWidth size="small"
//                 sx={{ mt: 2 }}
//                 value={form.overview}
//                 onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))} />
//             </SectionCard>

//             {/* Compliances */}
//             <SectionCard
//               title="Compliance Certifications"
//               icon={<CheckCircle sx={{ color: ACCENT, fontSize: 20 }} />}
//             >

//               {/* ── Section A: Compliance tags (existing behaviour unchanged) ───────── */}
//               <Typography
//                 variant="caption" color="text.secondary" fontWeight={600}
//                 sx={{ textTransform: "uppercase", letterSpacing: 0.5, mb: 1, display: "block" }}
//               >
//                 Compliance Tags
//               </Typography>

//               <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
//                 {form.compliances.map((c) => (
//                   <Chip
//                     key={c} label={c} size="small"
//                     onDelete={() => removeCompliance(c)}
//                     sx={{ fontWeight: 600, bgcolor: "#e8f0fe", color: ACCENT }}
//                   />
//                 ))}
//               </Box>

//               <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
//                 <TextField
//                   size="small"
//                   placeholder="e.g. SOC2, ISO27001, HIPAA"
//                   value={complianceInput}
//                   onChange={(e) => setComplianceInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && addCompliance()}
//                 />
//                 <Button
//                   variant="outlined" startIcon={<Add />} onClick={addCompliance}
//                   sx={{ borderColor: ACCENT, color: ACCENT, whiteSpace: "nowrap" }}
//                 >
//                   Add Tag
//                 </Button>
//               </Box>

//               <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
//                 Press Enter or click Add. Examples: SOC2, ISO27001, HIPAA, GDPR, PCI-DSS
//               </Typography>

//               <Divider sx={{ mb: 3 }} />

//               {/* ── Section B: Certificate PDF upload ──────────────────────────────── */}
//               <Typography
//                 variant="caption" color="text.secondary" fontWeight={600}
//                 sx={{ textTransform: "uppercase", letterSpacing: 0.5, mb: 1.5, display: "block" }}
//               >
//                 Certificate Documents
//               </Typography>

//               {/* Upload form */}
//               <Paper elevation={0} sx={{
//                 border: "1px dashed #c7deff", borderRadius: 2,
//                 p: 2.5, mb: 3, bgcolor: "#f8fbff",
//               }}>
//                 <Box sx={{
//                   display: "grid",
//                   gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
//                   gap: 2,
//                   mb: 2,
//                 }}>
//                   <TextField
//                     size="small" label="Certificate Name *"
//                     placeholder="e.g. SOC 2 Type II Report 2024"
//                     value={certForm.name}
//                     onChange={(e) => setCertForm((f) => ({ ...f, name: e.target.value }))}
//                   />
//                   <TextField
//                     size="small" label="Standard"
//                     placeholder="e.g. SOC2, ISO27001"
//                     value={certForm.standard}
//                     onChange={(e) => setCertForm((f) => ({ ...f, standard: e.target.value }))}
//                   />
//                   <TextField
//                     size="small" label="Issued By"
//                     placeholder="e.g. Deloitte & Touche LLP"
//                     value={certForm.issuedBy}
//                     onChange={(e) => setCertForm((f) => ({ ...f, issuedBy: e.target.value }))}
//                   />
//                   <TextField
//                     size="small" label="Valid Until (optional)"
//                     type="date"
//                     value={certForm.validUntil}
//                     onChange={(e) => setCertForm((f) => ({ ...f, validUntil: e.target.value }))}
//                     InputLabelProps={{ shrink: true }}
//                   />
//                 </Box>

//                 <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
//                   <Button
//                     variant="outlined" size="small" startIcon={<CloudUpload />}
//                     onClick={() => certFileRef.current.click()}
//                     sx={{
//                       borderColor: certFile ? ACCENT : "#bdbdbd",
//                       color: certFile ? ACCENT : "text.secondary",
//                     }}
//                   >
//                     {certFile ? certFile.name : "Select PDF"}
//                   </Button>
//                   <input
//                     type="file" accept=".pdf"
//                     ref={certFileRef}
//                     style={{ display: "none" }}
//                     onChange={(e) => setCertFile(e.target.files[0] || null)}
//                   />
//                   <Button
//                     variant="contained" size="small"
//                     startIcon={
//                       uploadingCert
//                         ? <CircularProgress size={14} color="inherit" />
//                         : <CloudUpload />
//                     }
//                     onClick={handleUploadCert}
//                     disabled={uploadingCert || !certForm.name.trim() || !certFile}
//                     sx={{ bgcolor: ACCENT, "&:hover": { bgcolor: "#0353e9" } }}
//                   >
//                     {uploadingCert ? "Uploading…" : "Upload Certificate"}
//                   </Button>
//                 </Box>
//               </Paper>

//               {/* Certificates table */}
//               {!tc?.certifications?.length ? (
//                 <Paper elevation={0} sx={{
//                   border: "1px dashed #e0e0e0", borderRadius: 2,
//                   py: 3, textAlign: "center",
//                 }}>
//                   <VerifiedUser sx={{ color: "#bdbdbd", fontSize: 32, mb: 0.5 }} />
//                   <Typography color="text.secondary" fontSize={13}>
//                     No certificates uploaded yet.
//                   </Typography>
//                 </Paper>
//               ) : (
//                 <TableContainer component={Paper} elevation={0}
//                   sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
//                   <Table size="small">
//                     <TableHead sx={{ bgcolor: SURFACE }}>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Certificate</TableCell>
//                         <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Standard</TableCell>
//                         <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Issued By</TableCell>
//                         <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Valid Until</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12 }}>Actions</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {tc.certifications.map((cert) => {
//                         // Warn visually if cert is expired
//                         const isExpired = cert.validUntil && new Date(cert.validUntil) < new Date();
//                         return (
//                           <TableRow key={cert.name} hover>
//                             <TableCell>
//                               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                 <VerifiedUser fontSize="small"
//                                   sx={{ color: isExpired ? DANGER : ACCENT }} />
//                                 <Typography fontSize={13} fontWeight={600}>{cert.name}</Typography>
//                               </Box>
//                             </TableCell>
//                             <TableCell>
//                               {cert.standard ? (
//                                 <Chip
//                                   label={cert.standard} size="small"
//                                   sx={{ bgcolor: "#e8f0fe", color: ACCENT, fontWeight: 600, fontSize: 11 }}
//                                 />
//                               ) : "—"}
//                             </TableCell>
//                             <TableCell>
//                               <Typography fontSize={13} color="text.secondary">
//                                 {cert.issuedBy || "—"}
//                               </Typography>
//                             </TableCell>
//                             <TableCell>
//                               {cert.validUntil ? (
//                                 <Typography
//                                   fontSize={12}
//                                   sx={{ color: isExpired ? DANGER : "text.secondary", fontWeight: isExpired ? 600 : 400 }}
//                                 >
//                                   {new Date(cert.validUntil).toLocaleDateString("en-GB", {
//                                     day: "2-digit", month: "short", year: "numeric",
//                                   })}
//                                   {isExpired && " ⚠️"}
//                                 </Typography>
//                               ) : (
//                                 <Typography fontSize={12} color="text.secondary">—</Typography>
//                               )}
//                             </TableCell>
//                             <TableCell align="right">
//                               <Tooltip title="View PDF">
//                                 <IconButton size="small" onClick={() => handleViewCert(cert.name)}>
//                                   <CloudDownload fontSize="small" sx={{ color: ACCENT }} />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Delete">
//                                 <IconButton size="small" onClick={() => handleRemoveCert(cert.name)}>
//                                   <Delete fontSize="small" sx={{ color: DANGER }} />
//                                 </IconButton>
//                               </Tooltip>
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}

//             </SectionCard>

//             {/* Save button */}
//             <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//               <Button variant="contained" onClick={handleSave} disabled={saving}
//                 startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveAlt />}
//                 sx={{ bgcolor: ACCENT, "&:hover": { bgcolor: "#0353e9" }, px: 4 }}>
//                 {saving ? "Saving…" : "Save Changes"}
//               </Button>
//             </Box>
//           </TabPanel>

//           {/* ══ Tab 1: Trusted By ═══════════════════════════════════════════ */}
//           <TabPanel value={tab} index={1}>
//             <SectionCard
//               title="Trusted By"
//               icon={<CheckCircle sx={{ color: ACCENT, fontSize: 20 }} />}
//             >
//               {/* Add form */}
//               <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
//                 <TextField size="small" label="Company Name" value={trustedByName}
//                   onChange={(e) => setTrustedByName(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleAddTrustedBy()} />
//                 <Button variant="outlined" size="small" startIcon={<CloudUpload />}
//                   onClick={() => trustedByIconRef.current.click()}
//                   sx={{ borderColor: "#bdbdbd", color: "text.secondary" }}>
//                   {trustedByIcon ? trustedByIcon.name : "Upload Icon (optional)"}
//                 </Button>
//                 <input type="file" accept="image/*" ref={trustedByIconRef}
//                   style={{ display: "none" }}
//                   onChange={(e) => setTrustedByIcon(e.target.files[0])} />
//                 <Button variant="contained" startIcon={<Add />}
//                   onClick={handleAddTrustedBy} disabled={addingTrustedBy || !trustedByName.trim()}
//                   sx={{ bgcolor: ACCENT }}>
//                   {addingTrustedBy ? "Adding…" : "Add"}
//                 </Button>
//               </Box>

//               {/* List */}
//               {!tc?.trustedBy?.length ? (
//                 <Typography color="text.secondary" variant="body2">
//                   No trusted-by entries yet. Add companies that trust your organisation.
//                 </Typography>
//               ) : (
//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
//                   {tc.trustedBy.map((entry) => (
//                     <Chip
//                       key={entry.companyName}
//                       label={entry.companyName}
//                       onDelete={() => handleRemoveTrustedBy(entry.companyName)}
//                       deleteIcon={<Delete fontSize="small" />}
//                       sx={{
//                         fontWeight: 600, bgcolor: SURFACE,
//                         border: "1px solid #e0e0e0", fontSize: 13
//                       }}
//                     />
//                   ))}
//                 </Box>
//               )}
//             </SectionCard>
//           </TabPanel>

//           {/* ══ Tab 2: Policies ═════════════════════════════════════════════ */}
//           <TabPanel value={tab} index={2}>
//             <SectionCard title="Policy Documents" icon={<Policy sx={{ color: ACCENT, fontSize: 20 }} />}>

//               {/* Upload form */}
//               <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
//                 <TextField size="small" label="Policy Name" value={policyName}
//                   onChange={(e) => setPolicyName(e.target.value)}
//                   placeholder="e.g. Acceptable Use Policy" />
//                 <Button variant="outlined" size="small" startIcon={<CloudUpload />}
//                   onClick={() => policyFileRef.current.click()}
//                   sx={{ borderColor: "#bdbdbd", color: "text.secondary" }}>
//                   {policyFile ? policyFile.name : "Select PDF"}
//                 </Button>
//                 <input type="file" accept=".pdf,.doc,.docx" ref={policyFileRef}
//                   style={{ display: "none" }}
//                   onChange={(e) => setPolicyFile(e.target.files[0])} />
//                 <Button variant="contained" startIcon={<CloudUpload />}
//                   onClick={handleUploadPolicy}
//                   disabled={uploadingPolicy || !policyName.trim() || !policyFile}
//                   sx={{ bgcolor: ACCENT }}>
//                   {uploadingPolicy ? "Uploading…" : "Upload"}
//                 </Button>
//               </Box>

//               {/* Table */}
//               {!tc?.policies?.length ? (
//                 <Typography color="text.secondary" variant="body2">
//                   No policies uploaded yet.
//                 </Typography>
//               ) : (
//                 <TableContainer component={Paper} elevation={0}
//                   sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
//                   <Table size="small">
//                     <TableHead sx={{ bgcolor: SURFACE }}>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 600 }}>Policy Name</TableCell>
//                         <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {tc.policies.map((p) => (
//                         <TableRow key={p.name} hover>
//                           <TableCell>
//                             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                               <Policy fontSize="small" sx={{ color: ACCENT }} />
//                               {p.name}
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Chip label={p.contentType || "document"} size="small"
//                               sx={{ fontSize: 11, bgcolor: "#e8f0fe", color: ACCENT }} />
//                           </TableCell>
//                           <TableCell align="right">
//                             <Tooltip title="Download">
//                               <IconButton size="small" onClick={() => handleDownloadPolicy(p.name)}>
//                                 <Download fontSize="small" sx={{ color: ACCENT }} />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Delete">
//                               <IconButton size="small" onClick={() => handleRemovePolicy(p.name)}>
//                                 <Delete fontSize="small" sx={{ color: DANGER }} />
//                               </IconButton>
//                             </Tooltip>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}
//             </SectionCard>
//           </TabPanel>

//           {/* ══ Tab 3: Sub-Processors ═══════════════════════════════════════ */}
//           <TabPanel value={tab} index={3}>
//             <SectionCard
//               title="Sub-Processors"
//               icon={<Language sx={{ color: ACCENT, fontSize: 20 }} />}
//               action={
//                 <Button variant="contained" size="small" startIcon={<Add />}
//                   onClick={() => setSpDialog(true)}
//                   sx={{ bgcolor: ACCENT, fontSize: 12 }}>
//                   Add Sub-Processor
//                 </Button>
//               }
//             >
//               {!tc?.subProcessors?.length ? (
//                 <Typography color="text.secondary" variant="body2">
//                   No sub-processors added yet.
//                 </Typography>
//               ) : (
//                 <TableContainer component={Paper} elevation={0}
//                   sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
//                   <Table size="small">
//                     <TableHead sx={{ bgcolor: SURFACE }}>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
//                         <TableCell sx={{ fontWeight: 600 }}>Purpose</TableCell>
//                         <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
//                         <TableCell sx={{ fontWeight: 600 }}>Website</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {tc.subProcessors.map((sp) => (
//                         <TableRow key={sp.name} hover>
//                           <TableCell sx={{ fontWeight: 600 }}>{sp.name}</TableCell>
//                           <TableCell>{sp.purpose}</TableCell>
//                           <TableCell>{sp.location}</TableCell>
//                           <TableCell>
//                             {sp.website && (
//                               <a href={sp.website} target="_blank" rel="noreferrer"
//                                 style={{ color: ACCENT, fontSize: 13 }}>
//                                 {sp.website}
//                               </a>
//                             )}
//                           </TableCell>
//                           <TableCell align="right">
//                             <Tooltip title="Remove">
//                               <IconButton size="small" onClick={() => handleRemoveSp(sp.name)}>
//                                 <Delete fontSize="small" sx={{ color: DANGER }} />
//                               </IconButton>
//                             </Tooltip>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}
//             </SectionCard>
//           </TabPanel>

//           {/* ══ Tab 4: Custom Domain ════════════════════════════════════════ */}
//           <TabPanel value={tab} index={4}>
//             <SectionCard title="Custom Domain" icon={<Domain sx={{ color: ACCENT, fontSize: 20 }} />}>

//               {tc?.customDomain ? (
//                 /* Domain already configured */
//                 <Box>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
//                     <Domain sx={{ color: ACCENT }} />
//                     <Typography fontWeight={600}>{tc.customDomain}</Typography>
//                     <Chip
//                       label={tc.customDomainVerified ? "Verified" : "Pending Verification"}
//                       size="small"
//                       icon={tc.customDomainVerified
//                         ? <VerifiedUser style={{ fontSize: 14 }} />
//                         : undefined}
//                       sx={{
//                         bgcolor: tc.customDomainVerified ? "#d9f2e6" : "#fff3cd",
//                         color: tc.customDomainVerified ? SUCCESS : "#856404",
//                         fontWeight: 600
//                       }}
//                     />
//                     <Button size="small" color="error" startIcon={<Delete />}
//                       onClick={handleRemoveDomain}>
//                       Remove
//                     </Button>
//                   </Box>

//                   {!tc.customDomainVerified && domainResult && (
//                     <Alert severity="info" sx={{ mb: 2 }}>
//                       <Typography variant="body2" fontWeight={600} mb={1}>
//                         Add this DNS TXT record at your DNS provider:
//                       </Typography>
//                       <Box sx={{
//                         fontFamily: "monospace", fontSize: 13, bgcolor: "#f4f4f4",
//                         p: 1.5, borderRadius: 1, mb: 1
//                       }}>
//                         <div><b>Name:</b> {domainResult.dnsInstructions?.recordName}</div>
//                         <div><b>Type:</b> TXT</div>
//                         <div><b>Value:</b> {domainResult.dnsInstructions?.recordValue}</div>
//                       </Box>
//                       <Typography variant="caption" color="text.secondary">
//                         DNS propagation can take up to 48 hours.
//                       </Typography>
//                       <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
//                         <Button size="small" variant="outlined"
//                           startIcon={<ContentCopy fontSize="small" />}
//                           onClick={() => {
//                             navigator.clipboard.writeText(domainResult.dnsInstructions?.recordValue);
//                             toast("TXT value copied!");
//                           }}>
//                           Copy Value
//                         </Button>
//                         <Button size="small" variant="contained"
//                           startIcon={verifyingDomain
//                             ? <CircularProgress size={14} color="inherit" />
//                             : <VerifiedUser fontSize="small" />}
//                           onClick={handleVerifyDomain} disabled={verifyingDomain}
//                           sx={{ bgcolor: ACCENT }}>
//                           {verifyingDomain ? "Verifying…" : "Verify Now"}
//                         </Button>
//                       </Box>
//                     </Alert>
//                   )}

//                   {!tc.customDomainVerified && !domainResult && (
//                     <Alert severity="warning" sx={{ mb: 2 }}>
//                       Domain not yet verified. Add the DNS TXT record then click Verify.
//                       <Button size="small" sx={{ ml: 2 }}
//                         onClick={handleVerifyDomain} disabled={verifyingDomain}>
//                         {verifyingDomain ? "Checking…" : "Verify Now"}
//                       </Button>
//                     </Alert>
//                   )}

//                   {tc.customDomainVerified && (
//                     <Alert severity="success">
//                       Your Trust Centre is accessible at{" "}
//                       <strong>https://{tc.customDomain}</strong> once published.
//                     </Alert>
//                   )}
//                 </Box>
//               ) : (
//                 /* No domain configured yet */
//                 <Box>
//                   <Typography variant="body2" color="text.secondary" mb={2}>
//                     Point your own domain (e.g. <code>trust.acme.com</code>) to your Trust Centre.
//                     Add a CNAME record pointing to <code>calvant.com</code>, then configure it below.
//                   </Typography>
//                   <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
//                     <TextField size="small" label="Custom Domain"
//                       placeholder="trust.acme.com"
//                       value={domainInput}
//                       onChange={(e) => setDomainInput(e.target.value)}
//                       sx={{ width: 300 }} />
//                     <Button variant="contained" onClick={handleSetDomain}
//                       disabled={saving || !domainInput.trim()}
//                       sx={{ bgcolor: ACCENT }}>
//                       Configure
//                     </Button>
//                   </Box>
//                 </Box>
//               )}
//             </SectionCard>
//           </TabPanel>

//           {/* ══ Tab 5: Access Control ════════════════════════════════════════ */}
//           <TabPanel value={tab} index={5}>
//             <TrustCentreAccessTab
//               tc={tc}
//               setTc={setTc}
//               isPublished={isPublished}
//             />
//           </TabPanel>

//         </Box>
//       </Paper>

//       {/* ── Sub-Processor Dialog ─────────────────────────────────────────────── */}
//       <Dialog open={spDialog} onClose={() => setSpDialog(false)} maxWidth="sm" fullWidth
//         PaperProps={{ sx: { borderRadius: 2 } }}>
//         <DialogTitle sx={{ fontWeight: 700, borderBottom: "1px solid #e0e0e0" }}>
//           Add Sub-Processor
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
//             <TextField size="small" label="Name *" fullWidth value={spForm.name}
//               onChange={(e) => setSpForm((f) => ({ ...f, name: e.target.value }))} />
//             <TextField size="small" label="Purpose" fullWidth value={spForm.purpose}
//               onChange={(e) => setSpForm((f) => ({ ...f, purpose: e.target.value }))} />
//             <TextField size="small" label="Location" fullWidth value={spForm.location}
//               onChange={(e) => setSpForm((f) => ({ ...f, location: e.target.value }))} />
//             <TextField size="small" label="Website" fullWidth value={spForm.website}
//               onChange={(e) => setSpForm((f) => ({ ...f, website: e.target.value }))} />
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2 }}>
//           <Button onClick={() => setSpDialog(false)} sx={{ color: "text.secondary" }}>
//             Cancel
//           </Button>
//           <Button variant="contained" onClick={handleAddSp}
//             disabled={addingSp || !spForm.name.trim()}
//             sx={{ bgcolor: ACCENT }}>
//             {addingSp ? "Adding…" : "Add Sub-Processor"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ── Snackbar ─────────────────────────────────────────────────────────── */}
//       <Snackbar open={snack.open} autoHideDuration={4000}
//         onClose={() => setSnack((s) => ({ ...s, open: false }))}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
//         <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
//           {snack.msg}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import {
  Box, Typography, Button, TextField, Chip, Paper, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, CircularProgress, Alert, Snackbar, Divider, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Switch,
  FormControlLabel, LinearProgress, Badge
} from "@mui/material";
import {
  CloudUpload, Delete, Add, Publish, Unpublished, CheckCircle,
  Language, Policy, Business, Shield, Domain, VerifiedUser,
  ContentCopy, Download, Edit, SaveAlt, Lock, CloudDownload
} from "@mui/icons-material";
import {
  getTrustCentre,
  upsertTrustCentre,
  publishTrustCentre,
  unpublishTrustCentre,
  uploadLogo,
  getLogoUrl,
  addTrustedBy,
  removeTrustedBy,
  uploadPolicy,
  downloadPolicy,
  removePolicy,
  addSubProcessor,
  removeSubProcessor,
  setCustomDomain,
  verifyCustomDomain,
  removeCustomDomain,
  getInternalPreview,
  toggleShare,
  regenerateShareToken,
  listAccessRequests,
  getAccessRequest,
  approveAccessRequest,
  rejectAccessRequest,
  getTeamAccess,
  uploadCertification,
  downloadCertification,
  removeCertification,
} from "../../api/adminTrustCentreApi";
import * as api from "../../api/adminTrustCentreApi";
import TrustCentreAccessTab from "./TrustCentreAccessTab";

// ── Palette & style constants ─────────────────────────────────────────────────
const ACCENT = "#0f62fe";
const SUCCESS = "#24a148";
const DANGER = "#da1e28";
const SURFACE = "#f4f4f4";
const CARD_BG = "#ffffff";

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

// ── Reusable section card ─────────────────────────────────────────────────────
function SectionCard({ title, icon, children, action }) {
  return (
    <Paper elevation={0} sx={{
      border: "1px solid #e0e0e0", borderRadius: 2, mb: 3, overflow: "hidden"
    }}>
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 3, py: 2, borderBottom: "1px solid #e0e0e0", bgcolor: SURFACE
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {icon}
          <Typography fontWeight={600} fontSize={15}>{title}</Typography>
        </Box>
        {action}
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Paper>
  );
}

export default function TrustCentreAdmin() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tc, setTc] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  // Form state
  const [form, setForm] = useState({
    companyName: "", foundedYear: "", domain: "", overview: "",
    privacyPolicyLink: "", tosLink: "", compliances: []
  });
  const [complianceInput, setComplianceInput] = useState("");

  // Logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const logoInputRef = useRef();

  // Trusted by
  const [trustedByName, setTrustedByName] = useState("");
  const [trustedByIcon, setTrustedByIcon] = useState(null);
  const [addingTrustedBy, setAddingTrustedBy] = useState(false);
  const trustedByIconRef = useRef();

  // Policies
  const [policyName, setPolicyName] = useState("");
  const [policyFile, setPolicyFile] = useState(null);
  const [uploadingPolicy, setUploadingPolicy] = useState(false);
  const policyFileRef = useRef();

  // Certifications
  const certFileRef = useRef();
  const [certForm, setCertForm] = useState({ name: "", standard: "", issuedBy: "", validUntil: "" });
  const [certFile, setCertFile] = useState(null);
  const [uploadingCert, setUploadingCert] = useState(false);

  // Sub-processors
  const [spDialog, setSpDialog] = useState(false);
  const [spForm, setSpForm] = useState({ name: "", purpose: "", location: "", website: "" });
  const [addingSp, setAddingSp] = useState(false);

  // Custom domain
  const [domainInput, setDomainInput] = useState("");
  const [domainResult, setDomainResult] = useState(null);
  const [verifyingDomain, setVerifyingDomain] = useState(false);

  // Access Control — pending request badge count
  const [pendingCount, setPendingCount] = useState(0);

  // ── Load data ───────────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getTrustCentre();
      if (data && !data.error) {
        setTc(data);
        setForm({
          companyName: data.companyName || "",
          foundedYear: data.foundedYear || "",
          domain: data.domain || "",
          overview: data.overview || "",
          privacyPolicyLink: data.privacyPolicyLink || "",
          tosLink: data.tosLink || "",
          compliances: data.compliances || [],
        });
        if (data.organization) {
          setLogoPreview(api.getLogoUrl(data.organization));
        }
      }

      // Fetch pending access request count for the badge
      try {
        const pending = await api.listAccessRequests("PENDING");
        setPendingCount(Array.isArray(pending) ? pending.length : 0);
      } catch (_) {
        // Non-critical — badge just shows 0
      }
    } catch (e) {
      // First time — no record yet, that's fine
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toast = (msg, severity = "success") =>
    setSnack({ open: true, msg, severity });

  // ── Save metadata ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await api.upsertTrustCentre(form);
      setTc(result);
      toast("Trust Centre saved successfully.");
    } catch (e) {
      toast("Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Publish / Unpublish ─────────────────────────────────────────────────────
  const handlePublish = async () => {
    setSaving(true);
    try {
      const result = await api.publishTrustCentre();
      setTc((prev) => ({ ...prev, ...result, publishStatus: "PUBLISHED" }));
      toast("Trust Centre is now LIVE for all org users! 🚀");
    } catch (e) {
      toast("Publish failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublish = async () => {
    setSaving(true);
    try {
      await api.unpublishTrustCentre();
      setTc((prev) => ({ ...prev, publishStatus: "DRAFT" }));
      toast("Trust Centre reverted to DRAFT.");
    } catch (e) {
      toast("Unpublish failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Logo ────────────────────────────────────────────────────────────────────
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setSaving(true);
    try {
      await api.uploadLogo(logoFile);
      setLogoFile(null);
      toast("Logo uploaded successfully.");
    } catch (e) {
      toast("Logo upload failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Compliances ─────────────────────────────────────────────────────────────
  const addCompliance = () => {
    const v = complianceInput.trim().toUpperCase();
    if (v && !form.compliances.includes(v)) {
      setForm((f) => ({ ...f, compliances: [...f.compliances, v] }));
    }
    setComplianceInput("");
  };

  const removeCompliance = (c) =>
    setForm((f) => ({ ...f, compliances: f.compliances.filter((x) => x !== c) }));

  // ── Trusted By ──────────────────────────────────────────────────────────────
  const handleAddTrustedBy = async () => {
    if (!trustedByName.trim()) return;
    setAddingTrustedBy(true);
    try {
      const result = await api.addTrustedBy(trustedByName.trim(), trustedByIcon);
      setTc(result);
      setTrustedByName("");
      setTrustedByIcon(null);
      toast("Trusted-by entry added.");
    } catch (e) {
      toast("Failed to add.", "error");
    } finally {
      setAddingTrustedBy(false);
    }
  };

  const handleRemoveTrustedBy = async (name) => {
    try {
      const result = await api.removeTrustedBy(name);
      setTc(result);
      toast(`Removed "${name}".`);
    } catch (e) {
      toast("Remove failed.", "error");
    }
  };

  // ── Policies ────────────────────────────────────────────────────────────────
  const handleUploadPolicy = async () => {
    if (!policyName.trim() || !policyFile) return;
    setUploadingPolicy(true);
    try {
      await api.uploadPolicy(policyName.trim(), policyFile);
      setPolicyName("");
      setPolicyFile(null);
      await load();
      toast(`Policy "${policyName}" uploaded.`);
    } catch (e) {
      toast("Policy upload failed.", "error");
    } finally {
      setUploadingPolicy(false);
    }
  };

  const handleDownloadPolicy = async (name) => {
    try {
      const blob = await api.downloadPolicy(name, tc.organization);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
    } catch (e) {
      toast("Download failed.", "error");
    }
  };

  const handleRemovePolicy = async (name) => {
    try {
      await api.removePolicy(name);
      await load();
      toast(`Policy "${name}" deleted.`);
    } catch (e) {
      toast("Delete failed.", "error");
    }
  };

  // ── Certifications ──────────────────────────────────────────────────────────
  const handleUploadCert = async () => {
    if (!certForm.name.trim() || !certFile) return;
    setUploadingCert(true);
    try {
      const result = await uploadCertification(
        certForm.name.trim(),
        certForm.standard.trim(),
        certForm.issuedBy.trim(),
        certForm.validUntil,
        certFile
      );
      // Server already strips binary — result.certifications is metadata only
      setTc((prev) => ({ ...prev, certifications: result.certifications || [] }));
      setCertForm({ name: "", standard: "", issuedBy: "", validUntil: "" });
      setCertFile(null);
      if (certFileRef.current) certFileRef.current.value = "";
      toast(`Certification "${certForm.name}" uploaded.`);
    } catch (e) {
      toast("Certification upload failed.", "error");
    } finally {
      setUploadingCert(false);
    }
  };

  const handleViewCert = async (certName) => {
    try {
      const blob = await downloadCertification(certName, tc.organization);
      const url  = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      toast("Failed to open certificate.", "error");
    }
  };

  const handleRemoveCert = async (certName) => {
    try {
      await removeCertification(certName);
      setTc((prev) => ({
        ...prev,
        certifications: (prev.certifications || []).filter((c) => c.name !== certName),
      }));
      toast(`Certification "${certName}" removed.`);
    } catch (e) {
      toast("Remove failed.", "error");
    }
  };

  // ── Sub-Processors ──────────────────────────────────────────────────────────
  const handleAddSp = async () => {
    if (!spForm.name.trim()) return;
    setAddingSp(true);
    try {
      const result = await api.addSubProcessor(spForm);
      setTc(result);
      setSpForm({ name: "", purpose: "", location: "", website: "" });
      setSpDialog(false);
      toast("Sub-processor added.");
    } catch (e) {
      toast("Failed to add sub-processor.", "error");
    } finally {
      setAddingSp(false);
    }
  };

  const handleRemoveSp = async (name) => {
    try {
      await api.removeSubProcessor(name);
      await load();
      toast(`Sub-processor "${name}" removed.`);
    } catch (e) {
      toast("Remove failed.", "error");
    }
  };

  // ── Custom Domain ───────────────────────────────────────────────────────────
  const handleSetDomain = async () => {
    if (!domainInput.trim()) return;
    setSaving(true);
    try {
      const result = await api.setCustomDomain(domainInput.trim());
      setDomainResult(result);
      setTc((prev) => ({ ...prev, customDomain: result.customDomain, customDomainVerified: false }));
      toast("Domain configured. Add the DNS TXT record shown below.");
    } catch (e) {
      toast(e.message || "Failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyDomain = async () => {
    setVerifyingDomain(true);
    try {
      const result = await api.verifyCustomDomain();
      setTc((prev) => ({ ...prev, customDomainVerified: true }));
      setDomainResult(null);
      toast("Domain verified! ✅ " + result.message);
    } catch (e) {
      toast("Verification failed. Check DNS propagation and retry.", "error");
    } finally {
      setVerifyingDomain(false);
    }
  };

  const handleRemoveDomain = async () => {
    try {
      await api.removeCustomDomain();
      setTc((prev) => ({ ...prev, customDomain: null, customDomainVerified: false }));
      setDomainResult(null);
      setDomainInput("");
      toast("Custom domain removed.");
    } catch (e) {
      toast("Remove failed.", "error");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <CircularProgress sx={{ color: ACCENT }} />
        <Typography mt={2} color="text.secondary">Loading Trust Centre…</Typography>
      </Box>
    );
  }

  const isPublished = tc?.publishStatus === "PUBLISHED";

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, margin: "0 auto" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        mb: 4, flexWrap: "wrap", gap: 2
      }}>
        <Box>
          <Typography variant="h5" fontWeight={700} letterSpacing={-0.5}>
            Trust Centre
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage your organisation's public trust profile
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Status badge */}
          <Chip
            label={isPublished ? "PUBLISHED" : "DRAFT"}
            size="small"
            sx={{
              fontWeight: 700, fontSize: 11, letterSpacing: 0.5,
              bgcolor: isPublished ? "#d9f2e6" : "#fff3cd",
              color: isPublished ? SUCCESS : "#856404",
              border: `1px solid ${isPublished ? "#a3d9b8" : "#ffc107"}`
            }}
          />

          {isPublished ? (
            <Button
              variant="outlined" size="small" startIcon={<Unpublished />}
              onClick={handleUnpublish} disabled={saving}
              sx={{
                borderColor: DANGER, color: DANGER,
                "&:hover": { bgcolor: "#fff5f5", borderColor: DANGER }
              }}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              variant="contained" size="small" startIcon={<Publish />}
              onClick={handlePublish} disabled={saving}
              sx={{ bgcolor: ACCENT, "&:hover": { bgcolor: "#0353e9" } }}
            >
              Publish
            </Button>
          )}
        </Box>
      </Box>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            borderBottom: "1px solid #e0e0e0",
            bgcolor: SURFACE,
            "& .MuiTab-root": { fontSize: 13, fontWeight: 600, textTransform: "none", minWidth: 120 },
            "& .Mui-selected": { color: ACCENT },
            "& .MuiTabs-indicator": { bgcolor: ACCENT }
          }}
        >
          <Tab icon={<Business fontSize="small" />} iconPosition="start" label="General" />
          <Tab icon={<Shield fontSize="small" />} iconPosition="start" label="Trusted By" />
          <Tab icon={<Policy fontSize="small" />} iconPosition="start" label="Policies" />
          <Tab icon={<Language fontSize="small" />} iconPosition="start" label="Sub-Processors" />
          <Tab icon={<Domain fontSize="small" />} iconPosition="start" label="Custom Domain" />
          <Tab
            iconPosition="start"
            label="Access Control"
            icon={
              <Badge badgeContent={pendingCount} color="error" max={9}>
                <Lock fontSize="small" />
              </Badge>
            }
          />
        </Tabs>

        <Box sx={{ p: 3 }}>

          {/* ══ Tab 0: General ═══════════════════════════════════════════════ */}
          <TabPanel value={tab} index={0}>

            {/* Logo */}
            <SectionCard title="Company Logo" icon={<Business sx={{ color: ACCENT, fontSize: 20 }} />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{
                  width: 96, height: 96, borderRadius: 2, border: "1px dashed #bdbdbd",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", bgcolor: SURFACE, cursor: "pointer", flexShrink: 0
                }} onClick={() => logoInputRef.current.click()}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      onError={() => setLogoPreview(null)} />
                  ) : (
                    <CloudUpload sx={{ color: "#bdbdbd", fontSize: 32 }} />
                  )}
                </Box>
                <input type="file" accept="image/*" ref={logoInputRef}
                  style={{ display: "none" }} onChange={handleLogoChange} />
                <Box>
                  <Button variant="outlined" size="small" startIcon={<CloudUpload />}
                    onClick={() => logoInputRef.current.click()}
                    sx={{ mr: 1, mb: 1, borderColor: ACCENT, color: ACCENT }}>
                    Choose Logo
                  </Button>
                  {logoFile && (
                    <Button variant="contained" size="small" startIcon={<SaveAlt />}
                      onClick={handleLogoUpload} disabled={saving}
                      sx={{ bgcolor: ACCENT, mb: 1 }}>
                      Upload
                    </Button>
                  )}
                  <Typography variant="caption" display="block" color="text.secondary">
                    PNG recommended · Max 2MB
                  </Typography>
                  {logoFile && (
                    <Typography variant="caption" color={ACCENT}>
                      Selected: {logoFile.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            </SectionCard>

            {/* Basic info */}
            <SectionCard title="Company Information" icon={<Business sx={{ color: ACCENT, fontSize: 20 }} />}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <TextField label="Company Name" size="small" fullWidth
                  value={form.companyName}
                  onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} />
                <TextField label="Founded Year" size="small" fullWidth
                  value={form.foundedYear}
                  onChange={(e) => setForm((f) => ({ ...f, foundedYear: e.target.value }))} />
                <TextField label="Website Domain" size="small" fullWidth
                  placeholder="acme.com"
                  value={form.domain}
                  onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))} />
                <TextField label="Privacy Policy URL" size="small" fullWidth
                  value={form.privacyPolicyLink}
                  onChange={(e) => setForm((f) => ({ ...f, privacyPolicyLink: e.target.value }))} />
                <TextField label="Terms of Service URL" size="small" fullWidth
                  value={form.tosLink}
                  onChange={(e) => setForm((f) => ({ ...f, tosLink: e.target.value }))} />
              </Box>
              <TextField label="Overview" multiline rows={4} fullWidth size="small"
                sx={{ mt: 2 }}
                value={form.overview}
                onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))} />
            </SectionCard>

            {/* ── Compliance Certifications (REPLACED) ─────────────────────── */}
            <SectionCard
              title="Compliance Certifications"
              icon={<CheckCircle sx={{ color: ACCENT, fontSize: 20 }} />}
            >

              {/* ── Section A: Compliance tags ────────────────────────────── */}
              <Typography
                variant="caption" color="text.secondary" fontWeight={600}
                sx={{ textTransform: "uppercase", letterSpacing: 0.5, mb: 1, display: "block" }}
              >
                Compliance Tags
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                {form.compliances.map((c) => (
                  <Chip
                    key={c} label={c} size="small"
                    onDelete={() => removeCompliance(c)}
                    sx={{ fontWeight: 600, bgcolor: "#e8f0fe", color: ACCENT }}
                  />
                ))}
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  placeholder="e.g. SOC2, ISO27001, HIPAA"
                  value={complianceInput}
                  onChange={(e) => setComplianceInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCompliance()}
                />
                <Button
                  variant="outlined" startIcon={<Add />}
                  onClick={addCompliance}
                  sx={{ borderColor: ACCENT, color: ACCENT, whiteSpace: "nowrap" }}
                >
                  Add Tag
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* ── Section B: Certification PDFs ─────────────────────────── */}
              <Typography
                variant="caption" color="text.secondary" fontWeight={600}
                sx={{ textTransform: "uppercase", letterSpacing: 0.5, mb: 2, display: "block" }}
              >
                Certification Documents
              </Typography>

              {/* Upload form */}
              <Box sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 2,
              }}>
                <TextField
                  label="Certificate Name *"
                  size="small"
                  fullWidth
                  placeholder="e.g. SOC 2 Type II Report 2024"
                  value={certForm.name}
                  onChange={(e) => setCertForm((f) => ({ ...f, name: e.target.value }))}
                />
                <TextField
                  label="Standard / Tag"
                  size="small"
                  fullWidth
                  placeholder="e.g. SOC2"
                  value={certForm.standard}
                  onChange={(e) => setCertForm((f) => ({ ...f, standard: e.target.value }))}
                />
                <TextField
                  label="Issued By"
                  size="small"
                  fullWidth
                  placeholder="e.g. Deloitte"
                  value={certForm.issuedBy}
                  onChange={(e) => setCertForm((f) => ({ ...f, issuedBy: e.target.value }))}
                />
                <TextField
                  label="Valid Until"
                  size="small"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={certForm.validUntil}
                  onChange={(e) => setCertForm((f) => ({ ...f, validUntil: e.target.value }))}
                />
              </Box>

              {/* File picker row */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={certFileRef}
                  style={{ display: "none" }}
                  onChange={(e) => setCertFile(e.target.files[0] || null)}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CloudUpload />}
                  onClick={() => certFileRef.current.click()}
                  sx={{ borderColor: ACCENT, color: ACCENT }}
                >
                  Choose PDF
                </Button>
                {certFile && (
                  <Typography variant="caption" color={ACCENT}>
                    {certFile.name}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  size="small"
                  startIcon={uploadingCert ? <CircularProgress size={14} color="inherit" /> : <VerifiedUser />}
                  onClick={handleUploadCert}
                  disabled={uploadingCert || !certForm.name.trim() || !certFile}
                  sx={{ bgcolor: ACCENT, "&:hover": { bgcolor: "#0353e9" }, ml: "auto" }}
                >
                  {uploadingCert ? "Uploading…" : "Upload Certificate"}
                </Button>
              </Box>

              {/* Certifications table */}
              {(tc?.certifications || []).length > 0 && (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 1, mt: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: SURFACE }}>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Standard</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Issued By</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Valid Until</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(tc.certifications || []).map((cert) => (
                        <TableRow key={cert.name} hover>
                          <TableCell sx={{ fontSize: 13 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <VerifiedUser sx={{ fontSize: 15, color: SUCCESS }} />
                              {cert.name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {cert.standard ? (
                              <Chip
                                label={cert.standard}
                                size="small"
                                sx={{ fontWeight: 600, bgcolor: "#e8f0fe", color: ACCENT, fontSize: 11 }}
                              />
                            ) : "—"}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13 }}>{cert.issuedBy || "—"}</TableCell>
                          <TableCell sx={{ fontSize: 13 }}>{cert.validUntil || "—"}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="View / Download">
                              <IconButton
                                size="small"
                                onClick={() => handleViewCert(cert.name)}
                                sx={{ color: ACCENT }}
                              >
                                <CloudDownload fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove">
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveCert(cert.name)}
                                sx={{ color: DANGER }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {(tc?.certifications || []).length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: "italic" }}>
                  No certification documents uploaded yet.
                </Typography>
              )}

            </SectionCard>

            {/* Save button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained" startIcon={<SaveAlt />}
                onClick={handleSave} disabled={saving}
                sx={{ bgcolor: ACCENT, "&:hover": { bgcolor: "#0353e9" } }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </Box>

          </TabPanel>

          {/* ══ Tab 1: Trusted By ════════════════════════════════════════════ */}
          <TabPanel value={tab} index={1}>
            <SectionCard
              title="Trusted By"
              icon={<Shield sx={{ color: ACCENT, fontSize: 20 }} />}
              action={
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    size="small" placeholder="Company name"
                    value={trustedByName}
                    onChange={(e) => setTrustedByName(e.target.value)}
                    sx={{ width: 180 }}
                  />
                  <input type="file" accept="image/*" ref={trustedByIconRef}
                    style={{ display: "none" }}
                    onChange={(e) => setTrustedByIcon(e.target.files[0] || null)} />
                  <Tooltip title="Optional icon">
                    <IconButton size="small" onClick={() => trustedByIconRef.current.click()}
                      sx={{ border: "1px solid #e0e0e0" }}>
                      <CloudUpload fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Button variant="contained" size="small" startIcon={<Add />}
                    onClick={handleAddTrustedBy} disabled={addingTrustedBy || !trustedByName.trim()}
                    sx={{ bgcolor: ACCENT }}>
                    Add
                  </Button>
                </Box>
              }
            >
              {trustedByIcon && (
                <Typography variant="caption" color={ACCENT} sx={{ mb: 1, display: "block" }}>
                  Icon selected: {trustedByIcon.name}
                </Typography>
              )}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {(tc?.trustedBy || []).map((t) => (
                  <Chip
                    key={t.companyName || t}
                    label={t.companyName || t}
                    onDelete={() => handleRemoveTrustedBy(t.companyName || t)}
                    sx={{ fontWeight: 500 }}
                  />
                ))}
                {(tc?.trustedBy || []).length === 0 && (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    No companies added yet.
                  </Typography>
                )}
              </Box>
            </SectionCard>
          </TabPanel>

          {/* ══ Tab 2: Policies ══════════════════════════════════════════════ */}
          <TabPanel value={tab} index={2}>
            <SectionCard
              title="Policy Documents"
              icon={<Policy sx={{ color: ACCENT, fontSize: 20 }} />}
            >
              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
                <TextField label="Policy Name" size="small" sx={{ flex: 1, minWidth: 200 }}
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)} />
                <input type="file" accept="application/pdf" ref={policyFileRef}
                  style={{ display: "none" }}
                  onChange={(e) => setPolicyFile(e.target.files[0] || null)} />
                <Button variant="outlined" size="small" startIcon={<CloudUpload />}
                  onClick={() => policyFileRef.current.click()}
                  sx={{ borderColor: ACCENT, color: ACCENT }}>
                  Choose PDF
                </Button>
                {policyFile && (
                  <Typography variant="caption" color={ACCENT}>{policyFile.name}</Typography>
                )}
                <Button variant="contained" size="small"
                  startIcon={uploadingPolicy ? <CircularProgress size={14} color="inherit" /> : <CloudUpload />}
                  onClick={handleUploadPolicy}
                  disabled={uploadingPolicy || !policyName.trim() || !policyFile}
                  sx={{ bgcolor: ACCENT }}>
                  {uploadingPolicy ? "Uploading…" : "Upload"}
                </Button>
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: SURFACE }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Policy Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(tc?.policies || []).map((p) => (
                      <TableRow key={p.name || p} hover>
                        <TableCell sx={{ fontSize: 13 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Policy sx={{ fontSize: 15, color: ACCENT }} />
                            {p.name || p}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Download">
                            <IconButton size="small" onClick={() => handleDownloadPolicy(p.name || p)}
                              sx={{ color: ACCENT }}>
                              <Download fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleRemovePolicy(p.name || p)}
                              sx={{ color: DANGER }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(tc?.policies || []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            No policies uploaded yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </SectionCard>
          </TabPanel>

          {/* ══ Tab 3: Sub-Processors ════════════════════════════════════════ */}
          <TabPanel value={tab} index={3}>
            <SectionCard
              title="Sub-Processors"
              icon={<Language sx={{ color: ACCENT, fontSize: 20 }} />}
              action={
                <Button variant="contained" size="small" startIcon={<Add />}
                  onClick={() => setSpDialog(true)}
                  sx={{ bgcolor: ACCENT }}>
                  Add
                </Button>
              }
            >
              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: SURFACE }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Purpose</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(tc?.subProcessors || []).map((sp) => (
                      <TableRow key={sp.name} hover>
                        <TableCell sx={{ fontSize: 13, fontWeight: 500 }}>{sp.name}</TableCell>
                        <TableCell sx={{ fontSize: 13 }}>{sp.purpose || "—"}</TableCell>
                        <TableCell sx={{ fontSize: 13 }}>{sp.location || "—"}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Remove">
                            <IconButton size="small" onClick={() => handleRemoveSp(sp.name)}
                              sx={{ color: DANGER }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(tc?.subProcessors || []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            No sub-processors added yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </SectionCard>

            {/* Add Sub-Processor Dialog */}
            <Dialog open={spDialog} onClose={() => setSpDialog(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Add Sub-Processor</DialogTitle>
              <DialogContent>
                <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
                  <TextField label="Name *" size="small" fullWidth value={spForm.name}
                    onChange={(e) => setSpForm((f) => ({ ...f, name: e.target.value }))} />
                  <TextField label="Purpose" size="small" fullWidth value={spForm.purpose}
                    onChange={(e) => setSpForm((f) => ({ ...f, purpose: e.target.value }))} />
                  <TextField label="Location" size="small" fullWidth value={spForm.location}
                    onChange={(e) => setSpForm((f) => ({ ...f, location: e.target.value }))} />
                  <TextField label="Website" size="small" fullWidth value={spForm.website}
                    onChange={(e) => setSpForm((f) => ({ ...f, website: e.target.value }))} />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSpDialog(false)}>Cancel</Button>
                <Button variant="contained" onClick={handleAddSp} disabled={addingSp || !spForm.name.trim()}
                  sx={{ bgcolor: ACCENT }}>
                  {addingSp ? "Adding…" : "Add"}
                </Button>
              </DialogActions>
            </Dialog>
          </TabPanel>

          {/* ══ Tab 4: Custom Domain ══════════════════════════════════════════ */}
          <TabPanel value={tab} index={4}>
            <SectionCard
              title="Custom Domain"
              icon={<Domain sx={{ color: ACCENT, fontSize: 20 }} />}
            >
              {tc?.customDomain ? (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Chip
                      label={tc.customDomain}
                      icon={tc.customDomainVerified
                        ? <CheckCircle sx={{ color: SUCCESS + " !important" }} />
                        : <Domain />}
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      label={tc.customDomainVerified ? "Verified" : "Pending Verification"}
                      size="small"
                      sx={{
                        bgcolor: tc.customDomainVerified ? "#d9f2e6" : "#fff3cd",
                        color: tc.customDomainVerified ? SUCCESS : "#856404",
                      }}
                    />
                  </Box>

                  {!tc.customDomainVerified && domainResult && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Add this DNS TXT record to verify ownership:
                      <Box component="code" sx={{ display: "block", mt: 1, p: 1, bgcolor: "#f4f4f4", borderRadius: 1, fontSize: 13 }}>
                        {domainResult.verificationRecord || domainResult.txtRecord || "See your DNS settings."}
                      </Box>
                    </Alert>
                  )}

                  <Box sx={{ display: "flex", gap: 1 }}>
                    {!tc.customDomainVerified && (
                      <Button variant="outlined" size="small"
                        startIcon={verifyingDomain ? <CircularProgress size={14} /> : <CheckCircle />}
                        onClick={handleVerifyDomain} disabled={verifyingDomain}
                        sx={{ borderColor: SUCCESS, color: SUCCESS }}>
                        {verifyingDomain ? "Verifying…" : "Verify Now"}
                      </Button>
                    )}
                    <Button variant="outlined" size="small" startIcon={<Delete />}
                      onClick={handleRemoveDomain}
                      sx={{ borderColor: DANGER, color: DANGER }}>
                      Remove Domain
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                  <TextField
                    label="Custom Domain" size="small" sx={{ flex: 1, minWidth: 240 }}
                    placeholder="trust.yourdomain.com"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                  />
                  <Button variant="contained" size="small"
                    onClick={handleSetDomain} disabled={saving || !domainInput.trim()}
                    sx={{ bgcolor: ACCENT }}>
                    Configure
                  </Button>
                </Box>
              )}
            </SectionCard>
          </TabPanel>

          {/* ══ Tab 5: Access Control ════════════════════════════════════════ */}
          <TabPanel value={tab} index={5}>
            <TrustCentreAccessTab />
          </TabPanel>

        </Box>
      </Paper>

      {/* ── Snackbar ───────────────────────────────────────────────────────── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>

    </Box>
  );
}