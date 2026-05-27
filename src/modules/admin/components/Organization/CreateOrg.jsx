import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../api/adminApi";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  ListItemText,
  Checkbox,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import SaveIcon from "@mui/icons-material/Save";
import SecurityIcon from "@mui/icons-material/Security";
import ShieldIcon from "@mui/icons-material/Shield";
import PeopleIcon from "@mui/icons-material/People"; // ✅ Added Icon for Max Users

// ✅ Must stay in sync with OrganizationController.ALLOWED_FRAMEWORKS
const FRAMEWORK_OPTIONS = [
  { value: "ISO27001", label: "ISO 27001 — Information Security" },
  { value: "ISO27701", label: "ISO 27701 — Privacy Information" },
  { value: "SOC2", label: "SOC 2 — Service Organization Controls" },
  { value: "ISO42001", label: "ISO 42001 — AI Management System" },
  { value: "GDPR", label: "GDPR — General Data Protection Regulation" },
  { value: "KSA_PDPL", label: "KSA PDPL — Personal Data Protection Law" },
  { value: "DPDPR", label: "DPDPR - Digital Personal Data Protection Rules" },
];

function CreateOrg() {
  const [name, setName] = useState("");
  const [frameworks, setFrameworks] = useState([]);
  const [tprmEnabled, setTprmEnabled] = useState("false");
  const [maxUsers, setMaxUsers] = useState(""); // ✅ Added Max Users state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const history = useHistory();

  const handleFrameworkChange = (event) => {
    const { value } = event.target;
    setFrameworks(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Organization name is required");
    if (frameworks.length === 0)
      return setError("Please select at least one compliance framework");

    setLoading(true);
    try {
      await api.post("/organizations", {
        name: name.trim(),
        frameworks,
        tprmEnabled: tprmEnabled === "true", // ✅ cast to boolean for backend
        maxUsers: maxUsers ? parseInt(maxUsers, 10) : null, // ✅ format MaxUsers for DB safely
      });
      history.push("/organizations/list");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data ||
          "Failed to create organization"
      );
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* ── Organization Name ──────────────────────────────── */}
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, mb: 4 }}>
            <BusinessIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              fullWidth
              label="Organization Name"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corp"
              disabled={loading}
              autoFocus
              helperText="This name will be used for billing and reports."
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ── Max Users (Quota) ──────────────────────────────── */}
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, mb: 4 }}>
            <PeopleIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              fullWidth
              label="Maximum Users Limit"
              variant="standard"
              type="number"
              inputProps={{ min: 1 }}
              value={maxUsers}
              onChange={(e) => setMaxUsers(e.target.value)}
              placeholder="e.g. 50 (Leave blank for no limit)"
              disabled={loading}
              helperText="Set a hard limit on how many users this organization can register."
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ── Compliance Frameworks ──────────────────────────── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <SecurityIcon sx={{ color: "action.active", flexShrink: 0 }} />
            <FormControl fullWidth>
              <InputLabel id="frameworks-label">
                Compliance Frameworks *
              </InputLabel>
              <Select
                labelId="frameworks-label"
                multiple
                value={frameworks}
                onChange={handleFrameworkChange}
                input={<OutlinedInput label="Compliance Frameworks *" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((val) => (
                      <Chip
                        key={val}
                        label={val}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
                disabled={loading}
              >
                {FRAMEWORK_OPTIONS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    <Checkbox checked={frameworks.includes(value)} />
                    <ListItemText
                      primary={value}
                      secondary={label.split("—")[1]?.trim()}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ── TPRM Toggle ────────────────────────────────────── */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 4 }}>
            <ShieldIcon sx={{ color: "action.active", mt: 0.5, flexShrink: 0 }} />
            <Box>
              <FormLabel
                component="legend"
                sx={{ fontWeight: 500, color: "text.primary", mb: 0.5 }}
              >
                Enable TPRM (Third-Party Risk Management)
              </FormLabel>
              <Box sx={{ color: "text.secondary", fontSize: 13, mb: 1 }}>
                Enables vendor risk assessments and third-party monitoring for
                this organization.
              </Box>
              <RadioGroup
                row
                value={tprmEnabled}
                onChange={(e) => setTprmEnabled(e.target.value)}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio disabled={loading} color="primary" />}
                  label="Yes — Enable TPRM"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio disabled={loading} />}
                  label="No — Skip for now"
                />
              </RadioGroup>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ── Actions ───────────────────────────────────────── */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => history.push("/organizations/list")}
              disabled={loading}
            >
              Organisation List
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{ px: 4 }}
            >
              {loading ? "Creating..." : "Create Organisation"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateOrg;