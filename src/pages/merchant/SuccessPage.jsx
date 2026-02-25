import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WifiIcon from "@mui/icons-material/Wifi";
import HomeIcon from "@mui/icons-material/Home";

const steps = [
  "Enquiry Submitted",
  "Expert Calls You",
  "Availability Confirmed",
  "Installation Booked",
];

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reference = location.state?.reference || "BB-00000";
  const businessName = location.state?.businessName || "Your Business";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
        <WifiIcon color="primary" fontSize="large" />
        <Typography variant="h6" color="primary" fontWeight={700}>
          BroadbandConnect
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 580, width: "100%" }}>
        <CardContent sx={{ p: 5, textAlign: "center" }}>
          {/* Success Icon */}
          <CheckCircleIcon
            sx={{ fontSize: 72, color: "success.main", mb: 2 }}
          />

          {/* Heading */}
          <Typography variant="h4" fontWeight={700} gutterBottom>
            You're All Set!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Thank you, <strong>{businessName}</strong>. Your enquiry has been
            received and a broadband expert will be in touch within 24 hours.
          </Typography>

          {/* Reference Number */}
          <Box
            sx={{
              backgroundColor: "#f0f7ff",
              borderRadius: 2,
              px: 3,
              py: 2,
              mb: 4,
              display: "inline-block",
              width: "100%",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Your Reference Number
            </Typography>
            <Typography
              variant="h5"
              fontWeight={800}
              color="primary"
              letterSpacing={2}
            >
              {reference}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Please keep this for your records
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* What Happens Next — Stepper */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
            What Happens Next
          </Typography>

          <Stepper activeStep={0} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mb: 4 }} />

          {/* Info boxes */}
          <Box sx={{ display: "flex", gap: 2, mb: 4, textAlign: "left" }}>
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                📞 Expect a Call
              </Typography>
              <Typography variant="body2" color="text.secondary">
                An expert will call within 24 business hours to discuss your
                options.
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                📧 Check Your Email
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A confirmation email has been sent with your reference number.
              </Typography>
            </Box>
          </Box>

          {/* CTA */}
          <Button
            variant="outlined"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            fullWidth
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 3 }}>
        Need help? Contact us at support@broadbandconnect.co.uk
      </Typography>
    </Box>
  );
}
