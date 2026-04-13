import { useState, useEffect } from "react";
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
  Chip,
  AppBar,
  Toolbar,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import PeopleIcon from "@mui/icons-material/People";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LogoutIcon from "@mui/icons-material/Logout";
import { getAllLeads, updateLeadStatus } from "../../api/api";

const statusColors = { New: "info", Contacted: "warning", Closed: "success" };
const statusOptions = ["New", "Contacted", "Closed"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await getAllLeads();
        setLeads(res.data);
      } catch (err) {
        setError("Failed to load leads.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const totalLeads = leads.length;
  const totalPartners = [...new Set(leads.map((l) => l.partner))].length;
  const conversionRate = totalLeads
    ? Math.round(
        (leads.filter((l) => l.status === "Closed").length / totalLeads) * 100,
      )
    : 0;

  const filtered = leads.filter((l) => {
    const matchStatus = filter === "All" || l.status === filter;
    const matchSearch =
      l.business.toLowerCase().includes(search.toLowerCase()) ||
      l.partner.toLowerCase().includes(search.toLowerCase()) ||
      l.postcode.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeadStatus(id, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
      );
    } catch {
      setError("Failed to update status.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/partner/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
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
            startIcon={<PeopleIcon />}
            onClick={() => navigate("/admin/partners")}
            sx={{ mr: 1 }}
          >
            Manage Partners
          </Button>
          <Button
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            color="error"
            variant="outlined"
            size="small"
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Full system overview.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              label: "Total Leads",
              value: totalLeads,
              icon: <LeaderboardIcon fontSize="large" />,
              color: "#e3f2fd",
            },
            {
              label: "Active Partners",
              value: totalPartners,
              icon: <PeopleIcon fontSize="large" />,
              color: "#f3e5f5",
            },
            {
              label: "Conversion Rate",
              value: `${conversionRate}%`,
              icon: <TrendingUpIcon fontSize="large" />,
              color: "#e8f5e9",
            },
          ].map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card sx={{ backgroundColor: stat.color }}>
                <CardContent
                  sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}
                >
                  <Box sx={{ color: "primary.main" }}>{stat.icon}</Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={800}>
                      {stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            label="Search business, partner or postcode"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter}
              label="Status"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              {statusOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Business</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Provider</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Paying</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Update Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>View</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      No leads found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((lead) => (
                    <TableRow key={lead.id} hover>
                      <TableCell>
                        <strong>{lead.fullName}</strong>
                      </TableCell>
                      <TableCell>{lead.businessName}</TableCell>
                      <TableCell>{lead.currentProvider}</TableCell>
                      <TableCell>£{lead.monthlyPayment}/mo</TableCell>
                      <TableCell>
                        <Chip
                          label={lead.status}
                          color={statusColors[lead.status]}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                          <Select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value)
                            }
                          >
                            {statusOptions.map((s) => (
                              <MenuItem key={s} value={s}>
                                {s}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            navigate(`/admin/leads/${lead.id}`, {
                              state: { lead },
                            })
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
