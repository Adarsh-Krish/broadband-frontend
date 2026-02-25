import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Divider,
  Alert,
  Grid,
  Avatar,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    companyName: "Square Solutions",
    brandColor: "#1976d2",
    slug: "square",
    logo: null,
    logoPreview: null,
  });

  const referralLink = `https://broadbandconnect.co.uk/?partner=${form.slug}`;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, logo: file, logoPreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            Partner Portal
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/partner/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 720, mx: "auto", p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          White-Label Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Customise your partner portal and referral link.
        </Typography>

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Branding
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {/* Logo Upload */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Company Logo
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Avatar
                    src={form.logoPreview}
                    sx={{ width: 72, height: 72, border: "2px solid #e0e0e0" }}
                  >
                    {!form.logoPreview && form.companyName[0]}
                  </Avatar>
                  <Button variant="outlined" component="label">
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleLogoUpload}
                    />
                  </Button>
                </Box>
              </Grid>

              {/* Company Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={form.companyName}
                  onChange={handleChange("companyName")}
                />
              </Grid>

              {/* Partner Slug */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Partner Slug"
                  value={form.slug}
                  onChange={handleChange("slug")}
                  helperText="Used in your referral link"
                />
              </Grid>

              {/* Brand Color */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Brand Colour
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <input
                    type="color"
                    value={form.brandColor}
                    onChange={handleChange("brandColor")}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                    }}
                  />
                  <TextField
                    size="small"
                    value={form.brandColor}
                    onChange={handleChange("brandColor")}
                    sx={{ width: 130 }}
                  />
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: form.brandColor,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Referral Link */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Referral Link
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Share this link with businesses to track leads back to you.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                fullWidth
                value={referralLink}
                InputProps={{ readOnly: true }}
                size="small"
                sx={{ backgroundColor: "#f5f5f5" }}
              />
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopy}
                sx={{ whiteSpace: "nowrap" }}
              >
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
}
