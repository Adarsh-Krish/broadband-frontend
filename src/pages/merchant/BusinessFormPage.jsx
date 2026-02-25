import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  AppBar,
  Toolbar,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BoltIcon from "@mui/icons-material/Bolt";
import StarIcon from "@mui/icons-material/Star";
import { submitLead } from "../../api/api";

const initialForm = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  consent: false,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+44|0)[\d\s]{9,13}$/;

export default function BusinessFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const postcode = location.state?.postcode || "";
  const selectedPackage = location.state?.package || null;

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.businessName.trim())
      newErrors.businessName = "Business name is required";
    if (!form.contactName.trim())
      newErrors.contactName = "Contact name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(form.phone))
      newErrors.phone = "Enter a valid UK phone number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.consent) newErrors.consent = "You must agree to be contacted";
    return newErrors;
  };

  const handleChange = (field) => (e) => {
    const value = field === "consent" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setSubmitError("");
    try {
      const res = await submitLead({
        business: form.businessName,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        postcode,
        partner:
          new URLSearchParams(window.location.search).get("partner") ||
          "direct",
        package: selectedPackage?.provider || "Unknown",
      });
      navigate("/success", {
        state: {
          reference: res.data.reference,
          businessName: form.businessName,
        },
      });
    } catch (err) {
      setSubmitError(
        err.response?.data?.error || "Submission failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.businessName &&
    form.contactName &&
    form.email &&
    form.phone &&
    form.address &&
    form.consent;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* Top Bar */}
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ gap: 1 }}>
          <WifiIcon color="primary" />
          <Typography
            variant="h6"
            color="primary"
            fontWeight={700}
            sx={{ flexGrow: 1 }}
          >
            BroadbandConnect
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            size="small"
          >
            Back to Packages
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 860, mx: "auto", p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Your Business Details
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Fill in your details and a broadband expert will contact you shortly.
        </Typography>

        <Grid container spacing={4}>
          {/* LEFT — Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                {submitError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {submitError}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }} xs={12}>
                    <TextField
                      fullWidth
                      label="Business Name"
                      value={form.businessName}
                      onChange={handleChange("businessName")}
                      error={!!errors.businessName}
                      helperText={errors.businessName}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} xs={12}>
                    <TextField
                      fullWidth
                      label="Contact Name"
                      value={form.contactName}
                      onChange={handleChange("contactName")}
                      error={!!errors.contactName}
                      helperText={errors.contactName}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      error={!!errors.phone}
                      helperText={errors.phone}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} xs={12}>
                    <TextField
                      fullWidth
                      label="Business Address"
                      value={form.address}
                      onChange={handleChange("address")}
                      error={!!errors.address}
                      helperText={errors.address}
                      multiline
                      rows={2}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }} xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.consent}
                          onChange={handleChange("consent")}
                          color="primary"
                        />
                      }
                      label="I agree to be contacted by a broadband expert regarding my enquiry."
                    />
                    {errors.consent && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 0.5, ml: 2 }}
                      >
                        {errors.consent}
                      </Typography>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12 }} xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleSubmit}
                      disabled={loading || !isFormValid}
                    >
                      {loading ? (
                        <CircularProgress size={22} color="inherit" />
                      ) : (
                        "Request Connection"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT — Selected Package Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            {selectedPackage && (
              <Card
                sx={{
                  border: `2px solid ${selectedPackage.borderColor}`,
                  backgroundColor: selectedPackage.color,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="overline" color="text.secondary">
                    Selected Package
                  </Typography>

                  {selectedPackage.badge && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Chip
                        label={selectedPackage.badge}
                        size="small"
                        icon={
                          selectedPackage.badge === "Fastest" ? (
                            <BoltIcon />
                          ) : (
                            <StarIcon />
                          )
                        }
                        color={
                          selectedPackage.badge === "Fastest"
                            ? "secondary"
                            : "warning"
                        }
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                  )}

                  <Typography variant="h6" fontWeight={700}>
                    {selectedPackage.provider}
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Download
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {selectedPackage.download} Mbps
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
                      Upload
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {selectedPackage.upload} Mbps
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
                      Contract
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {selectedPackage.contract} months
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Monthly Cost
                    </Typography>
                    <Typography variant="h5" fontWeight={800} color="primary">
                      £{selectedPackage.price}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Postcode
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {postcode}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Help box */}
            <Card sx={{ mt: 2, backgroundColor: "#f0f7ff" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  What happens next?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1. Submit your details below
                  <br />
                  2. A broadband expert calls you within 24hrs
                  <br />
                  3. They confirm availability & pricing
                  <br />
                  4. Installation arranged at your convenience
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
