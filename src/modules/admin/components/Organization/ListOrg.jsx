import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../api/adminApi"; // Verify this path matches your project structure

// MUI Components
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip
} from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import BusinessIcon from "@mui/icons-material/Business";
import RefreshIcon from "@mui/icons-material/Refresh";

const ListOrg = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  
  const history = useHistory();

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/organizations");
      // Handle both array response or { data: [] } response format
      setOrgs(Array.isArray(data) ? data : data.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load organizations.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/organizations/${id}`);
fetchOrgs(); // Refresh list after deletion
    } catch (err) {
      alert("Failed to delete organization: " + (err.response?.data?.error || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Organizations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your client and internal organizations.
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Reload Data">
            <IconButton onClick={fetchOrgs} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => history.push("/organizations/create")}
          >
            Add Organization
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Table Section */}
      <Paper elevation={2} sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : orgs.length === 0 ? (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No organizations found.
            </Typography>
            <Button sx={{ mt: 2 }} onClick={() => history.push("/organizations/create")}>
              Create your first one
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="organization table">
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Region</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orgs.map((org) => (
                  <TableRow
                    key={org._id || org.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 }, "&:hover": { bgcolor: "#fafafa" } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <BusinessIcon color="action" />
                        <Typography variant="subtitle1" fontWeight="500">
                          {org.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        {org._id || org.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {/* Placeholder for region if your API returns it, otherwise generic */}
                      <Chip label={org.region || "Global"} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete Organization">
                        <span>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            color="error"
                            onClick={() => handleDelete(org._id || org.id)}
                            disabled={deletingId === (org._id || org.id)}
                          >
                            {deletingId === (org._id || org.id) ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <DeleteIcon />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default ListOrg;