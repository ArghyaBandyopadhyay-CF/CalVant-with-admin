import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   CALVANT · Onboarding Module
   Route: shown to "root" role users after login.
   Calls:  GET  /api/onboarding            → { progress, organization }
           PATCH /api/onboarding/step1     → save business info
           PATCH /api/onboarding/step2     → save dept/user IDs
           PATCH /api/onboarding/step3     → save training info
   User creation goes via: POST /api/users/register
   Dept creation goes via:  POST /api/departments
───────────────────────────────────────────────────────────────────────────── */

const API = "";            // Set your base URL e.g. "http://localhost:8080"
const getToken = () => localStorage.getItem("token") || "";

const authFetch = (url, opts = {}) =>
  fetch(`${API}${url}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}`, ...(opts.headers || {}) },
  });

// ── Palette constants ────────────────────────────────────────────────────────
const COLOR = {
  brand:      "#1D9E75",
  brandLight: "#E1F5EE",
  brandDark:  "#0F6E56",
  amber:      "#BA7517",
  amberLight: "#FAEEDA",
  danger:     "#E24B4A",
  dangerLight:"#FCEBEB",
  gray:       "#888780",
  grayLight:  "#F1EFE8",
  text:       "var(--color-text-primary)",
  textSub:    "var(--color-text-secondary)",
  border:     "var(--color-border-tertiary)",
  bg:         "var(--color-background-primary)",
  bgSec:      "var(--color-background-secondary)",
};

// ── Shared styles ────────────────────────────────────────────────────────────
const S = {
  input: {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `0.5px solid var(--color-border-secondary)`,
    background: "var(--color-background-primary)",
    color: "var(--color-text-primary)", fontSize: 14,
    outline: "none", boxSizing: "border-box",
  },
  label: { fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4, display: "block" },
  field: { display: "flex", flexDirection: "column", gap: 4 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  card: {
    background: "var(--color-background-primary)",
    border: `0.5px solid var(--color-border-tertiary)`,
    borderRadius: 12, padding: "1.25rem",
  },
  sectionTitle: { fontSize: 13, fontWeight: 500, color: COLOR.gray, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 },
  btn: (variant = "primary") => ({
    padding: "9px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500,
    cursor: "pointer", border: "none", transition: "opacity .15s",
    background: variant === "primary" ? COLOR.brand : "transparent",
    color: variant === "primary" ? "#fff" : "var(--color-text-primary)",
    border: variant === "ghost" ? `0.5px solid var(--color-border-secondary)` : "none",
  }),
  tag: (color = COLOR.brand) => ({
    display: "inline-flex", alignItems: "center", gap: 4,
    background: COLOR.brandLight, color: COLOR.brandDark,
    fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20,
  }),
  pill: (active) => ({
    padding: "5px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
    border: `0.5px solid ${active ? COLOR.brand : "var(--color-border-secondary)"}`,
    background: active ? COLOR.brandLight : "transparent",
    color: active ? COLOR.brandDark : "var(--color-text-secondary)",
    fontWeight: active ? 500 : 400, transition: "all .15s",
  }),
  err: { fontSize: 12, color: COLOR.danger, marginTop: 4 },
  success: { fontSize: 12, color: COLOR.brand, marginTop: 4 },
};

// ── Utility ──────────────────────────────────────────────────────────────────
const required = (val) => !val || String(val).trim() === "";

function Field({ label, req, error, children, hint }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{label}{req && <span style={{ color: COLOR.danger }}> *</span>}</label>
      {children}
      {hint && <span style={{ fontSize: 12, color: COLOR.gray }}>{hint}</span>}
      {error && <span style={S.err}>{error}</span>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", disabled, ...rest }) {
  return (
    <input
      style={{ ...S.input, background: disabled ? "var(--color-background-secondary)" : "var(--color-background-primary)", opacity: disabled ? 0.7 : 1 }}
      value={value || ""} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} type={type} disabled={disabled} {...rest}
    />
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select style={{ ...S.input }} value={value || ""} onChange={e => onChange(e.target.value)}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      style={{ ...S.input, resize: "vertical", lineHeight: 1.6 }}
      value={value || ""} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
    />
  );
}

function Badge({ children, color = "brand" }) {
  const colors = {
    brand:  { bg: COLOR.brandLight, text: COLOR.brandDark },
    amber:  { bg: COLOR.amberLight, text: COLOR.amber },
    danger: { bg: COLOR.dangerLight, text: COLOR.danger },
    gray:   { bg: COLOR.grayLight,  text: COLOR.gray },
  };
  const c = colors[color] || colors.brand;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 500, padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Spinner() {
  return (
    <span style={{ display: "inline-block", width: 16, height: 16, border: `2px solid ${COLOR.brandLight}`, borderTopColor: COLOR.brand, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
  );
}

// ── Step progress header ─────────────────────────────────────────────────────
function StepHeader({ current, steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {steps.map((step, i) => {
        const done = step.done;
        const active = i === current;
        const locked = !step.done && i > current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 80 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: done ? COLOR.brand : active ? COLOR.brandLight : COLOR.grayLight,
                border: `2px solid ${done ? COLOR.brand : active ? COLOR.brand : "var(--color-border-secondary)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 500,
                color: done ? "#fff" : active ? COLOR.brandDark : COLOR.gray,
                transition: "all .3s",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 11, fontWeight: active ? 500 : 400, color: active ? COLOR.brand : "var(--color-text-secondary)", textAlign: "center", whiteSpace: "nowrap" }}>
                {step.label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? COLOR.brand : "var(--color-border-tertiary)", margin: "0 4px", marginBottom: 22, transition: "background .3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STEP 1 — Business Information
// ════════════════════════════════════════════════════════════════════════════
function Step1({ org, saved, onComplete }) {
  const [form, setForm] = useState({
    legalEntityName:          org?.name || "",
    address:                  org?.address || "",
    phone:                    org?.phone || "",
    website:                  org?.website || "",
    industry:                 saved?.industry || "",
    totalEmployees:           saved?.totalEmployees || "",
    officeLocations:          saved?.officeLocations || "",
    complianceTeamSize:       saved?.complianceTeamSize || "",
    submittedByName:          saved?.submittedByName || "",
    submittedByDesignation:   saved?.submittedByDesignation || "",
    submittedByEmail:         saved?.submittedByEmail || "",
    primaryDomain:            saved?.primaryDomain || org?.website || "",
    desiredSubdomain:         saved?.desiredSubdomain || "",
    expectedGoLiveDate:       saved?.expectedGoLiveDate || "",
    regulatoryDeadlines:      saved?.regulatoryDeadlines || "",
    dataResidencyRequirements:saved?.dataResidencyRequirements || "",
  });
  const [errs, setErrs] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState("");

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.legalEntityName.trim()) e.legalEntityName = "Required";
    if (!form.submittedByName.trim()) e.submittedByName = "Required";
    if (!form.submittedByEmail.trim()) e.submittedByEmail = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.submittedByEmail)) e.submittedByEmail = "Invalid email";
    if (!form.expectedGoLiveDate) e.expectedGoLiveDate = "Required";
    return e;
  };

  const save = async () => {
    const e = validate();
    setErrs(e);
    if (Object.keys(e).length) return;
    setSaving(true); setApiErr("");
    try {
      const res = await authFetch("/api/onboarding/step1", {
        method: "PATCH",
        body: JSON.stringify({ businessInfo: { ...form, totalEmployees: Number(form.totalEmployees) || null, officeLocations: Number(form.officeLocations) || null, complianceTeamSize: Number(form.complianceTeamSize) || null } }),
      });
      if (!res.ok) { const t = await res.text(); setApiErr(t); return; }
      onComplete();
    } catch (e) { setApiErr("Network error"); }
    finally { setSaving(false); }
  };

  // Frameworks from org
  const frameworks = org?.frameworks || [];
  const tprm = org?.tprmEnabled;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Pre-filled info chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 16px", background: COLOR.brandLight, borderRadius: 10, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: COLOR.brandDark, fontWeight: 500 }}>Pre-filled from setup:</span>
        {frameworks.map(f => <Badge key={f}>{f}</Badge>)}
        {tprm && <Badge color="amber">TPRM enabled</Badge>}
        {org?.maxUsers && <Badge color="gray">User limit: {org.maxUsers}</Badge>}
      </div>

      {/* Section A — Client Overview */}
      <div style={S.card}>
        <div style={S.sectionTitle}>A · Client overview</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.grid2}>
            <Field label="Legal entity name" req error={errs.legalEntityName}>
              <Input value={form.legalEntityName} onChange={set("legalEntityName")} disabled />
            </Field>
            <Field label="Industry / sector">
              <Input value={form.industry} onChange={set("industry")} placeholder="e.g. Financial Services" />
            </Field>
          </div>
          <Field label="Registered address">
            <Textarea value={form.address} onChange={set("address")} rows={2} placeholder="Full registered address" />
          </Field>
          <div style={S.grid3}>
            <Field label="Phone">
              <Input value={form.phone} onChange={set("phone")} placeholder="+91-XXXXXXXXXX" />
            </Field>
            <Field label="Website">
              <Input value={form.website} onChange={set("website")} placeholder="www.example.com" />
            </Field>
            <Field label="Total employees (approx.)">
              <Input value={form.totalEmployees} onChange={set("totalEmployees")} type="number" placeholder="e.g. 500" />
            </Field>
          </div>
          <div style={S.grid2}>
            <Field label="Office locations in scope">
              <Input value={form.officeLocations} onChange={set("officeLocations")} type="number" placeholder="e.g. 3" />
            </Field>
            <Field label="Compliance team size">
              <Input value={form.complianceTeamSize} onChange={set("complianceTeamSize")} type="number" placeholder="e.g. 7" />
            </Field>
          </div>
        </div>
      </div>

      {/* Section B — Point of Contact */}
      <div style={S.card}>
        <div style={S.sectionTitle}>B · Point of contact (submitting this form)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.grid3}>
            <Field label="Full name" req error={errs.submittedByName}>
              <Input value={form.submittedByName} onChange={set("submittedByName")} placeholder="Jane Doe" />
            </Field>
            <Field label="Designation">
              <Input value={form.submittedByDesignation} onChange={set("submittedByDesignation")} placeholder="CISO" />
            </Field>
            <Field label="Email" req error={errs.submittedByEmail}>
              <Input value={form.submittedByEmail} onChange={set("submittedByEmail")} type="email" placeholder="jane@company.com" />
            </Field>
          </div>
        </div>
      </div>

      {/* Section C — Domain & Go-Live */}
      <div style={S.card}>
        <div style={S.sectionTitle}>C · Domain & go-live</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.grid2}>
            <Field label="Primary domain" hint="Your company's main web domain">
              <Input value={form.primaryDomain} onChange={set("primaryDomain")} placeholder="www.company.com" />
            </Field>
            <Field label="Desired Calvant subdomain" hint="e.g. company.calvant.com">
              <Input value={form.desiredSubdomain} onChange={set("desiredSubdomain")} placeholder="company.calvant.com" />
            </Field>
          </div>
          <div style={S.grid2}>
            <Field label="Expected go-live date" req error={errs.expectedGoLiveDate}>
              <Input value={form.expectedGoLiveDate} onChange={set("expectedGoLiveDate")} type="date" />
            </Field>
            <Field label="Regulatory deadlines" hint="Any compliance audit or regulatory deadlines">
              <Input value={form.regulatoryDeadlines} onChange={set("regulatoryDeadlines")} placeholder="e.g. ISO audit Sep 2025" />
            </Field>
          </div>
          <Field label="Data residency / sovereignty requirements">
            <Input value={form.dataResidencyRequirements} onChange={set("dataResidencyRequirements")} placeholder="e.g. Data must stay in India" />
          </Field>
        </div>
      </div>

      {apiErr && <div style={{ padding: "10px 14px", background: COLOR.dangerLight, color: COLOR.danger, borderRadius: 8, fontSize: 13 }}>{apiErr}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={S.btn("primary")} onClick={save} disabled={saving}>
          {saving ? <Spinner /> : "Save & continue →"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STEP 2 — Module Setup (Departments + Users)
// ════════════════════════════════════════════════════════════════════════════
const ROLE_OPTIONS = [
  "steering_committee_member","risk_owner","risk_manager",
  "process_owner","process_manager","auditor","audit_manager",
  "dpo","ciso","aio","user",
];

const MODULE_ROLES = {
  risk:       ["risk_owner","risk_manager"],
  policies:   ["process_owner","process_manager"],
  audit:      ["auditor","audit_manager"],
  compliance: ["steering_committee_member","dpo","ciso","aio"],
  tprm:       ["user"],
};

function DepartmentCreator({ org, deptIds, setDeptIds }) {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    authFetch("/api/departments").then(r => r.json()).then(d => { setDepartments(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const add = async () => {
    if (!newDept.trim()) return;
    setAdding(true); setErr("");
    try {
      const res = await authFetch("/api/departments", { method: "POST", body: JSON.stringify({ name: newDept.trim() }) });
      if (!res.ok) { const t = await res.text(); setErr(t); return; }
      const dept = await res.json();
      setDepartments(d => [...d, dept]);
      setDeptIds(ids => [...ids, dept.id]);
      setNewDept("");
    } catch { setErr("Failed to add department"); }
    finally { setAdding(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Input value={newDept} onChange={setNewDept} placeholder="Department name (e.g. IT, Finance, HR)" />
        <button style={{ ...S.btn("primary"), whiteSpace: "nowrap" }} onClick={add} disabled={adding}>
          {adding ? <Spinner /> : "+ Add"}
        </button>
      </div>
      {err && <span style={S.err}>{err}</span>}
      {loading ? <span style={{ fontSize: 13, color: COLOR.gray }}>Loading…</span> :
        departments.length === 0 ? <span style={{ fontSize: 13, color: COLOR.gray }}>No departments yet. Add your first one above.</span> :
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {departments.map(d => (
            <span key={d.id} style={{ ...S.tag(), cursor: "default" }}>
              ✓ {d.name}
            </span>
          ))}
        </div>
      }
    </div>
  );
}

function UserForm({ org, departments, onCreated }) {
  const blank = { name: "", email: "", password: "", role: [], department: [], modules: [] };
  const [form, setForm] = useState(blank);
  const [errs, setErrs] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState("");
  const [success, setSuccess] = useState("");

  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const toggleRole = r => setForm(f => ({ ...f, role: f.role.includes(r) ? f.role.filter(x => x !== r) : [...f.role, r] }));
  const toggleDept = id => setForm(f => ({ ...f, department: f.department.includes(id) ? f.department.filter(x => x !== id) : [...f.department, id] }));
  const toggleModule = m => setForm(f => ({ ...f, modules: f.modules.includes(m) ? f.modules.filter(x => x !== m) : [...f.modules, m] }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    if (!form.role.length) e.role = "Select at least one role";
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrs(e); setApiErr(""); setSuccess("");
    if (Object.keys(e).length) return;
    setSaving(true);
    try {
      const payload = { ...form, organization: org?.name };
      const res = await authFetch("/api/users/register", { method: "POST", body: JSON.stringify(payload) });
      if (!res.ok) { const t = await res.text(); setApiErr(t); return; }
      const user = await res.json();
      setSuccess(`${user.name} created successfully`);
      onCreated(user.id);
      setForm(blank);
    } catch { setApiErr("Network error"); }
    finally { setSaving(false); }
  };

  const modules = ["risk","policies","audit","compliance","tprm"].filter(m => {
    if (m === "tprm") return org?.tprmEnabled;
    return true;
  });

  return (
    <div style={{ ...S.card, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={S.sectionTitle}>Add a user</div>
      <div style={S.grid2}>
        <Field label="Full name" req error={errs.name}>
          <Input value={form.name} onChange={set("name")} placeholder="Jane Doe" />
        </Field>
        <Field label="Email" req error={errs.email}>
          <Input value={form.email} onChange={set("email")} type="email" placeholder="jane@company.com" />
        </Field>
      </div>
      <Field label="Temporary password" req error={errs.password}>
        <Input value={form.password} onChange={set("password")} type="password" placeholder="Min 6 characters" />
      </Field>

      <Field label="Roles" req error={errs.role}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ROLE_OPTIONS.map(r => (
            <button key={r} style={S.pill(form.role.includes(r))} onClick={() => toggleRole(r)}>{r.replace(/_/g," ")}</button>
          ))}
        </div>
      </Field>

      {form.role.includes("user") && (
        <Field label="Module access" hint="Required for 'user' role">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {modules.map(m => (
              <button key={m} style={S.pill(form.modules.includes(m))} onClick={() => toggleModule(m)}>{m}</button>
            ))}
          </div>
        </Field>
      )}

      {departments.length > 0 && (
        <Field label="Departments">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {departments.map(d => (
              <button key={d.id} style={S.pill(form.department.includes(d.id))} onClick={() => toggleDept(d.id)}>{d.name}</button>
            ))}
          </div>
        </Field>
      )}

      {apiErr && <div style={{ padding: "8px 12px", background: COLOR.dangerLight, color: COLOR.danger, borderRadius: 8, fontSize: 13 }}>{apiErr}</div>}
      {success && <div style={{ padding: "8px 12px", background: COLOR.brandLight, color: COLOR.brandDark, borderRadius: 8, fontSize: 13 }}>✓ {success}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={S.btn("primary")} onClick={submit} disabled={saving}>
          {saving ? <Spinner /> : "Create user"}
        </button>
      </div>
    </div>
  );
}

function Step2({ org, onComplete, savedUserIds, savedDeptIds }) {
  const [departments, setDepartments] = useState([]);
  const [deptIds, setDeptIds] = useState(savedDeptIds || []);
  const [userIds, setUserIds] = useState(savedUserIds || []);
  const [createdUsers, setCreatedUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState("");
  const [deptErr, setDeptErr] = useState("");

  useEffect(() => {
    authFetch("/api/departments").then(r => r.json()).then(setDepartments).catch(() => {});
  }, [deptIds]);

  const onUserCreated = (id) => setUserIds(ids => [...ids, id]);

  const complete = async () => {
    if (departments.length === 0) { setDeptErr("Please create at least one department before continuing."); return; }
    setDeptErr("");
    setSaving(true); setApiErr("");
    try {
      const res = await authFetch("/api/onboarding/step2", {
        method: "PATCH",
        body: JSON.stringify({ onboardedUserIds: userIds, onboardedDepartmentIds: deptIds }),
      });
      if (!res.ok) { const t = await res.text(); setApiErr(t); return; }
      onComplete();
    } catch { setApiErr("Network error"); }
    finally { setSaving(false); }
  };

  const modules = ["risk","policies","audit","compliance"];
  if (org?.tprmEnabled) modules.push("tprm");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Module Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
        {modules.map(m => {
          const icons = { risk: "🛡", policies: "📋", audit: "🔍", compliance: "✅", tprm: "🤝" };
          return (
            <div key={m} style={{ ...S.card, textAlign: "center", padding: "14px 10px" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{icons[m]}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: COLOR.brand, textTransform: "uppercase", letterSpacing: "0.06em" }}>{m}</div>
            </div>
          );
        })}
      </div>

      {/* Departments */}
      <div style={S.card}>
        <div style={S.sectionTitle}>Step 2a · Create departments first</div>
        <p style={{ fontSize: 13, color: COLOR.gray, marginBottom: 12, marginTop: 0 }}>
          Departments are needed before assigning users. Create all departments for your org here.
        </p>
        <DepartmentCreator org={org} deptIds={deptIds} setDeptIds={setDeptIds} />
        {deptErr && <div style={{ marginTop: 10, padding: "8px 12px", background: COLOR.dangerLight, color: COLOR.danger, borderRadius: 8, fontSize: 13 }}>{deptErr}</div>}
      </div>

      {/* Users */}
      <div>
        <div style={{ ...S.sectionTitle, marginBottom: 16 }}>Step 2b · Register users by role</div>
        <div style={{ padding: "10px 14px", background: COLOR.grayLight, borderRadius: 8, fontSize: 13, color: COLOR.gray, marginBottom: 16 }}>
          Create users for each module. Each user's module access is automatically set from their role — except for "user" role which requires explicit module selection.
        </div>

        {/* Role → Module guide */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 20 }}>
          {Object.entries(MODULE_ROLES).filter(([m]) => m !== "tprm" || org?.tprmEnabled).map(([mod, roles]) => (
            <div key={mod} style={{ ...S.card, padding: "12px" }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: COLOR.brand, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{mod}</div>
              {roles.map(r => <div key={r} style={{ fontSize: 12, color: "var(--color-text-secondary)", padding: "2px 0" }}>· {r.replace(/_/g," ")}</div>)}
            </div>
          ))}
        </div>

        <UserForm org={org} departments={departments} onCreated={onUserCreated} />

        {userIds.length > 0 && (
          <div style={{ marginTop: 14, padding: "10px 14px", background: COLOR.brandLight, borderRadius: 8 }}>
            <span style={{ fontSize: 13, color: COLOR.brandDark, fontWeight: 500 }}>{userIds.length} user{userIds.length !== 1 ? "s" : ""} added in this session</span>
          </div>
        )}
      </div>

      {apiErr && <div style={{ padding: "10px 14px", background: COLOR.dangerLight, color: COLOR.danger, borderRadius: 8, fontSize: 13 }}>{apiErr}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: COLOR.gray }}>You can always add more users later from the Users panel.</span>
        <button style={S.btn("primary")} onClick={complete} disabled={saving}>
          {saving ? <Spinner /> : "Complete step 2 →"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  STEP 3 — Training
// ════════════════════════════════════════════════════════════════════════════
const TRAINING_RESOURCES = [
  { title: "Platform Overview", desc: "Get familiar with the Calvant dashboard, navigation, and key modules.", duration: "15 min", icon: "🏠" },
  { title: "Risk Module Guide", desc: "Learn how to create, assign, and track risks in the risk register.", duration: "20 min", icon: "🛡" },
  { title: "Policy Management", desc: "Upload, version, and assign policies and SOPs to stakeholders.", duration: "18 min", icon: "📋" },
  { title: "Audit Workflows",    desc: "Configure audit schedules, assign auditors, and review evidence.", duration: "20 min", icon: "🔍" },
  { title: "Compliance Frameworks", desc: "Map controls to ISO 27001, SOC 2, GDPR, and other frameworks.", duration: "25 min", icon: "✅" },
  { title: "User & Role Admin", desc: "Manage users, departments, and role-based access from the admin panel.", duration: "12 min", icon: "👥" },
];

function Step3({ saved, onComplete }) {
  const [form, setForm] = useState({
    preferredDate:       saved?.preferredDate || "",
    trainingMode:        saved?.trainingMode || "",
    trainingContactName: saved?.trainingContactName || "",
    trainingContactEmail:saved?.trainingContactEmail || "",
    trainingContactPhone:saved?.trainingContactPhone || "",
    additionalNotes:     saved?.additionalNotes || "",
    acknowledged:        saved?.acknowledged || false,
  });
  const [errs, setErrs] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState("");

  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.preferredDate)            e.preferredDate = "Required";
    if (!form.trainingMode)             e.trainingMode  = "Required";
    if (!form.trainingContactName.trim()) e.trainingContactName = "Required";
    if (!form.trainingContactEmail.trim()) e.trainingContactEmail = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.trainingContactEmail)) e.trainingContactEmail = "Invalid email";
    if (!form.acknowledged)             e.acknowledged  = "Please acknowledge the training materials";
    return e;
  };

  const save = async () => {
    const e = validate();
    setErrs(e);
    if (Object.keys(e).length) return;
    setSaving(true); setApiErr("");
    try {
      const res = await authFetch("/api/onboarding/step3", { method: "PATCH", body: JSON.stringify({ trainingInfo: form }) });
      if (!res.ok) { const t = await res.text(); setApiErr(t); return; }
      onComplete();
    } catch { setApiErr("Network error"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Training resource library */}
      <div>
        <div style={S.sectionTitle}>Training resource library</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {TRAINING_RESOURCES.map((r, i) => (
            <div key={i} style={{ ...S.card, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 20 }}>{r.icon}</span>
                <span style={{ fontSize: 11, color: COLOR.gray, background: COLOR.grayLight, padding: "2px 8px", borderRadius: 12 }}>{r.duration}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{r.title}</div>
              <div style={{ fontSize: 12, color: COLOR.gray, lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduling form */}
      <div style={S.card}>
        <div style={S.sectionTitle}>Schedule your training session</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.grid2}>
            <Field label="Preferred date" req error={errs.preferredDate}>
              <Input value={form.preferredDate} onChange={set("preferredDate")} type="date" />
            </Field>
            <Field label="Training mode" req error={errs.trainingMode}>
              <Select value={form.trainingMode} onChange={set("trainingMode")}
                placeholder="Select mode"
                options={["Online","Offline","Both – Online + Offline"]} />
            </Field>
          </div>

          <div style={S.sectionTitle}>Training point of contact</div>
          <div style={S.grid3}>
            <Field label="Full name" req error={errs.trainingContactName}>
              <Input value={form.trainingContactName} onChange={set("trainingContactName")} placeholder="Jane Doe" />
            </Field>
            <Field label="Email" req error={errs.trainingContactEmail}>
              <Input value={form.trainingContactEmail} onChange={set("trainingContactEmail")} type="email" placeholder="jane@company.com" />
            </Field>
            <Field label="Phone">
              <Input value={form.trainingContactPhone} onChange={set("trainingContactPhone")} placeholder="+91-XXXXXXXXXX" />
            </Field>
          </div>

          <Field label="Additional notes">
            <Textarea value={form.additionalNotes} onChange={set("additionalNotes")} placeholder="Any specific topics, timing preferences, or questions for the Calvant team…" />
          </Field>
        </div>
      </div>

      {/* Acknowledgement */}
      <div style={{ padding: "14px 16px", background: COLOR.amberLight, borderRadius: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <input
          type="checkbox"
          id="ack"
          checked={form.acknowledged}
          onChange={e => set("acknowledged")(e.target.checked)}
          style={{ marginTop: 2, accentColor: COLOR.brand, width: 16, height: 16, cursor: "pointer" }}
        />
        <label htmlFor="ack" style={{ fontSize: 13, color: COLOR.amber, cursor: "pointer", lineHeight: 1.6 }}>
          I confirm that I have reviewed the training resources above and understand that a Calvant team member will reach out to confirm the training schedule.
        </label>
      </div>
      {errs.acknowledged && <span style={S.err}>{errs.acknowledged}</span>}

      {apiErr && <div style={{ padding: "10px 14px", background: COLOR.dangerLight, color: COLOR.danger, borderRadius: 8, fontSize: 13 }}>{apiErr}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={S.btn("primary")} onClick={save} disabled={saving}>
          {saving ? <Spinner /> : "Complete onboarding →"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  COMPLETION SCREEN
// ════════════════════════════════════════════════════════════════════════════
function CompletionScreen({ orgName }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: COLOR.brandLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
        🎉
      </div>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 500, margin: "0 0 8px", color: "var(--color-text-primary)" }}>
          Welcome to Calvant, {orgName}!
        </h2>
        <p style={{ fontSize: 15, color: COLOR.gray, margin: 0, maxWidth: 480, lineHeight: 1.7 }}>
          Your onboarding is complete. Your workspace is set up and your team has been invited. A Calvant account manager will be in touch to confirm your training session.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, width: "100%", maxWidth: 480 }}>
        {[
          { icon: "✓", label: "Business info saved" },
          { icon: "✓", label: "Team configured" },
          { icon: "✓", label: "Training scheduled" },
        ].map((item, i) => (
          <div key={i} style={{ padding: "12px", background: COLOR.brandLight, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 18, color: COLOR.brand, marginBottom: 4 }}>{item.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: COLOR.brandDark }}>{item.label}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: COLOR.gray }}>
        You can now close this wizard — all settings are accessible from your admin panel.
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function OnboardingModule() {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [progress, setProgress] = useState(null);
  const [org, setOrg]           = useState(null);
  const [activeStep, setActiveStep] = useState(0);  // 0-based

  const fetchProgress = useCallback(async () => {
    try {
      const res = await authFetch("/api/onboarding");
      if (!res.ok) { setError("Could not load onboarding data."); return; }
      const data = await res.json();
      setProgress(data.progress);
      setOrg(data.organization);
      // Resume at the first incomplete step
      if (!data.progress.step1Completed)      setActiveStep(0);
      else if (!data.progress.step2Completed) setActiveStep(1);
      else if (!data.progress.step3Completed) setActiveStep(2);
      else                                     setActiveStep(3);  // all done
    } catch { setError("Network error. Please refresh."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const steps = [
    { label: "Business info",  done: progress?.step1Completed },
    { label: "Module setup",   done: progress?.step2Completed },
    { label: "Training",       done: progress?.step3Completed },
  ];

  const advance = async () => {
    await fetchProgress();   // re-fetch persisted state from server
  };

  if (loading) return (
    <div style={{ padding: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: COLOR.gray }}>
      <Spinner /> <span style={{ fontSize: 14 }}>Loading your onboarding…</span>
    </div>
  );

  if (error) return (
    <div style={{ padding: 24, background: COLOR.dangerLight, color: COLOR.danger, borderRadius: 10, fontSize: 14 }}>{error}</div>
  );

  const allDone = progress?.step1Completed && progress?.step2Completed && progress?.step3Completed;

  return (
    <div style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", maxWidth: 860, margin: "0 auto", padding: "2rem 1rem" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: COLOR.brand, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>C</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: COLOR.gray, letterSpacing: "0.04em", textTransform: "uppercase" }}>Calvant · Onboarding</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-primary)" }}>
          {allDone ? `Welcome, ${org?.name}` : `Set up ${org?.name || "your workspace"}`}
        </h1>
        {!allDone && (
          <p style={{ fontSize: 14, color: COLOR.gray, margin: 0 }}>
            Complete the three steps below to get your team fully up and running on Calvant.
          </p>
        )}
      </div>

      {allDone ? (
        <CompletionScreen orgName={org?.name} />
      ) : (
        <>
          <StepHeader current={activeStep} steps={steps} />

          {/* Step panels */}
          {activeStep === 0 && (
            <Step1
              org={org}
              saved={progress?.businessInfo}
              onComplete={advance}
            />
          )}
          {activeStep === 1 && (
            <Step2
              org={org}
              savedUserIds={progress?.onboardedUserIds}
              savedDeptIds={progress?.onboardedDepartmentIds}
              onComplete={advance}
            />
          )}
          {activeStep === 2 && (
            <Step3
              saved={progress?.trainingInfo}
              onComplete={advance}
            />
          )}
        </>
      )}
    </div>
  );
}