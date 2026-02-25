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
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import DownloadIcon from "@mui/icons-material/Download";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { getPartnerLeads } from "../../api/api";

const statusColors = { New: "info", Contacted: "warning", Closed: "success" };

export default function DashboardPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const slug = localStorage.getItem("slug") || "square";
  const name = localStorage.getItem("name") || "Partner";

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await getPartnerLeads(slug);
        setLeads(res.data);
      } catch (err) {
        setError("Failed to load leads. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [slug]);

  const totalLeads = leads.length;
  const closedDeals = leads.filter((l) => l.status === "Closed").length;
  const totalCommission = leads.reduce(
    (sum, l) => sum + (l.commission || 0),
    0,
  );

  const filtered = leads.filter((l) => {
    const matchStatus = filter === "All" || l.status === filter;
    const matchSearch =
      l.business.toLowerCase().includes(search.toLowerCase()) ||
      l.postcode.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleExport = () => {
    const csv = [
      ["Business", "Postcode", "Status", "Date", "Commission"],
      ...filtered.map((l) => [
        l.business,
        l.postcode,
        l.status,
        l.date,
        `£${l.commission}`,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
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
            Partner Portal — {name}
          </Typography>
          <Button
            startIcon={<SettingsIcon />}
            onClick={() => navigate("/partner/settings")}
            sx={{ mr: 1 }}
          >
            Settings
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

      <Box sx={{ maxWidth: 1100, mx: "auto", p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome back, <strong>{name}</strong>.
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
              icon: <PeopleIcon fontSize="large" />,
              color: "#e3f2fd",
            },
            {
              label: "Closed Deals",
              value: closedDeals,
              icon: <CheckCircleIcon fontSize="large" />,
              color: "#e8f5e9",
            },
            {
              label: "Commission Earned",
              value: `£${totalCommission}`,
              icon: <AttachMoneyIcon fontSize="large" />,
              color: "#fff8e1",
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
            label="Search business or postcode"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 260 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter}
              label="Status"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
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
                    <strong>Business</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Postcode</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Package</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Commission</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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
                        <strong>{lead.business}</strong>
                      </TableCell>
                      <TableCell>{lead.postcode}</TableCell>
                      <TableCell>{lead.package}</TableCell>
                      <TableCell>
                        <Chip
                          label={lead.status}
                          color={statusColors[lead.status]}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>{lead.date}</TableCell>
                      <TableCell>
                        <Typography
                          fontWeight={700}
                          color={
                            lead.commission > 0
                              ? "success.main"
                              : "text.secondary"
                          }
                        >
                          {lead.commission > 0 ? `£${lead.commission}` : "—"}
                        </Typography>
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
