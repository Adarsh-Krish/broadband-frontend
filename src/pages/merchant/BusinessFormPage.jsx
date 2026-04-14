import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  MenuItem,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import { submitLead } from "../../api/api";

const providers = [
  "BT",
  "Virgin Media",
  "Sky",
  "TalkTalk",
  "Vodafone",
  "EE",
  "Plusnet",
  "Other",
];

const initialForm = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  address: "",
  currentProvider: "",
  monthlyPayment: "",
  contractEndDate: "",
  notes: "",
  consent: false,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+44|0)[\d\s]{9,13}$/;

export default function BusinessFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.businessName.trim()) e.businessName = "Business name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!phoneRegex.test(form.phone))
      e.phone = "Enter a valid UK phone number";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.currentProvider)
      e.currentProvider = "Please select your current provider";
    if (!form.monthlyPayment.trim())
      e.monthlyPayment = "Monthly payment is required";
    if (!form.consent) e.consent = "You must agree to be contacted";
    return e;
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
        fullName: form.fullName,
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        currentProvider: form.currentProvider,
        monthlyPayment: Number(form.monthlyPayment),
        contractEndDate: form.contractEndDate,
        notes: form.notes,
      });
      navigate("/success", {
        state: {
          reference: res.data.reference,
          fullName: form.fullName,
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
    form.fullName &&
    form.businessName &&
    form.email &&
    form.phone &&
    form.address &&
    form.currentProvider &&
    form.monthlyPayment &&
    form.consent;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <WifiIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" color="primary" fontWeight={700}>
            BroadbandConnect
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 700, mx: "auto", p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Get a Better Deal on Broadband
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Fill in your details and a broadband expert will contact you with the
          best options for your business.
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Your Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Business Name *"
                  value={form.businessName}
                  onChange={handleChange("businessName")}
                  error={!!errors.businessName}
                  helperText={errors.businessName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address *"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Address / Postcode *"
                  value={form.address}
                  onChange={handleChange("address")}
                  error={!!errors.address}
                  helperText={errors.address}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
              Current Broadband
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Current Provider *"
                  value={form.currentProvider}
                  onChange={handleChange("currentProvider")}
                  error={!!errors.currentProvider}
                  helperText={errors.currentProvider}
                >
                  {providers.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monthly Payment (£) *"
                  value={form.monthlyPayment}
                  onChange={handleChange("monthlyPayment")}
                  error={!!errors.monthlyPayment}
                  helperText={errors.monthlyPayment}
                  placeholder="e.g. 45"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>£</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contract End Date"
                  type="month"
                  value={form.contractEndDate}
                  onChange={handleChange("contractEndDate")}
                  InputLabelProps={{ shrink: true }}
                  helperText="Optional"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  value={form.notes}
                  onChange={handleChange("notes")}
                  multiline
                  rows={3}
                  placeholder="e.g. Looking for faster speeds, need better reliability..."
                  helperText="Optional"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

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
                sx={{ display: "block", ml: 2 }}
              >
                {errors.consent}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              sx={{ mt: 3 }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Get a Better Deal →"
              )}
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 2, display: "block", textAlign: "center" }}
            >
              No commitment. A broadband expert will contact you within 24
              hours.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
