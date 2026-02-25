import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Chip,
  Divider,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const statusColors = {
  New: "info",
  Contacted: "warning",
  Closed: "success",
};

const statusOptions = ["New", "Contacted", "Closed"];

const timelineEvents = [
  { label: "Lead Submitted", date: "2024-01-15 09:32", color: "primary" },
  {
    label: "Assigned to Partner",
    date: "2024-01-15 09:35",
    color: "secondary",
  },
  {
    label: "Expert Contacted Business",
    date: "2024-01-16 11:00",
    color: "warning",
  },
];

export default function LeadDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const lead = location.state?.lead;

  const [status, setStatus] = useState(lead?.status || "New");
  const [saved, setSaved] = useState(false);

  if (!lead) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Lead not found.{" "}
          <Button onClick={() => navigate("/admin")}>Go Back</Button>
        </Alert>
      </Box>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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

      <Box sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {lead.business}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Lead Detail View
            </Typography>
          </Box>
          <Chip
            label={status}
            color={statusColors[status]}
            sx={{ fontWeight: 700, fontSize: 14, px: 1 }}
          />
        </Box>

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Status updated successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* LEFT — Business Info */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Business Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {[
                  {
                    icon: <BusinessIcon />,
                    label: "Business",
                    value: lead.business,
                  },
                  {
                    icon: <PersonIcon />,
                    label: "Partner",
                    value: lead.partner,
                  },
                  {
                    icon: <LocationOnIcon />,
                    label: "Postcode",
                    value: lead.postcode,
                  },
                  {
                    icon: <EmailIcon />,
                    label: "Email",
                    value:
                      "contact@" +
                      lead.business.toLowerCase().replace(/\s/g, "") +
                      ".co.uk",
                  },
                  {
                    icon: <PhoneIcon />,
                    label: "Phone",
                    value: "07700 900 123",
                  },
                ].map((row) => (
                  <Box
                    key={row.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ color: "primary.main", display: "flex" }}>
                      {row.icon}
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {row.label}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {row.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Update Status */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Update Status
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setSaved(false);
                    }}
                  >
                    {statusOptions.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSave}
                >
                  Save Status
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT — Timeline */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Activity Timeline
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  {timelineEvents.map((event, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 2, mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: "primary.main",
                            mt: 0.5,
                            flexShrink: 0,
                          }}
                        />
                        {index < timelineEvents.length - 1 && (
                          <Box
                            sx={{
                              width: 2,
                              flexGrow: 1,
                              backgroundColor: "#e0e0e0",
                              mt: 0.5,
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ pb: 2 }}>
                        <Typography variant="body2" fontWeight={700}>
                          {event.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.date}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Lead Summary */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Lead Summary
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Submitted
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {lead.date}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Partner
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {lead.partner}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Current Status
                  </Typography>
                  <Chip
                    label={status}
                    color={statusColors[status]}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
