import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  TextField,
  Grid,
  Divider,
  Avatar,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import { getAllPartners, createPartner, deletePartner } from "../../api/api";

const initialPartners = [
  {
    id: 1,
    name: "Square Solutions",
    slug: "square",
    commission: 15,
    leads: 34,
    status: "Active",
  },
  {
    id: 2,
    name: "Apex Digital",
    slug: "apex",
    commission: 12,
    leads: 21,
    status: "Active",
  },
  {
    id: 3,
    name: "BlueSky Referrals",
    slug: "bluesky",
    commission: 10,
    leads: 8,
    status: "Inactive",
  },
];

const emptyForm = { name: "", slug: "", commission: "" };

export default function PartnerManagement() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllPartners();
        setPartners(res.data);
      } catch {
        // fallback to empty
      } finally {
        setLoadingData(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    else if (partners.find((p) => p.slug === form.slug))
      e.slug = "Slug already exists";
    if (!form.commission) e.commission = "Commission is required";
    else if (
      isNaN(form.commission) ||
      +form.commission < 0 ||
      +form.commission > 100
    )
      e.commission = "Enter a valid % between 0–100";
    return e;
  };

  const handleCreate = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    try {
      const res = await createPartner({
        name: form.name,
        slug: form.slug,
        commission: +form.commission,
      });
      setPartners((prev) => [...prev, res.data.partner]);
      setForm(emptyForm);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrors({
        slug: err.response?.data?.error || "Failed to create partner",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePartner(id);
      setPartners((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // handle error
    }
    setDeleteDialog(null);
  };
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* Top Bar */}
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <WifiIcon color="primary" sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            color="primary"
            fontWeight={700}
            sx={{ flexGrow: 1 }}
          >
            Admin Panel
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin")}
          >
            Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1100, mx: "auto", p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Partner Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Create and manage your introducer partners.
        </Typography>

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Partner created successfully!
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* LEFT — Create Form */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  <AddIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Create Partner
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <TextField
                  fullWidth
                  label="Partner Name"
                  value={form.name}
                  onChange={handleChange("name")}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Slug"
                  value={form.slug}
                  onChange={handleChange("slug")}
                  error={!!errors.slug}
                  helperText={errors.slug || 'e.g. "square" → ?partner=square'}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Commission %"
                  type="number"
                  value={form.commission}
                  onChange={handleChange("commission")}
                  error={!!errors.commission}
                  helperText={errors.commission}
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ mb: 3 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleCreate}
                >
                  Create Partner
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT — Partners Table */}
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>
                      <strong>Partner</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Slug</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Commission</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Leads</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Action</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id} hover>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "primary.main",
                              fontSize: 14,
                            }}
                          >
                            {partner.name[0]}
                          </Avatar>
                          <Typography fontWeight={600}>
                            {partner.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            backgroundColor: "#f5f5f5",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontFamily: "monospace",
                            display: "inline-block",
                          }}
                        >
                          {partner.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700} color="primary">
                          {partner.commission}%
                        </Typography>
                      </TableCell>
                      <TableCell>{partner.leads}</TableCell>
                      <TableCell>
                        <Chip
                          label={partner.status}
                          color={
                            partner.status === "Active" ? "success" : "default"
                          }
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => setDeleteDialog(partner)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete Partner</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{deleteDialog?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleDelete(deleteDialog.id)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
