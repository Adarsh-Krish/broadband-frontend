import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Button, Typography } from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";

export default function PostcodePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 480, width: "100%" }}>
        <CardContent sx={{ p: 5, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 4,
            }}
          >
            <WifiIcon color="primary" fontSize="large" />
            <Typography variant="h6" color="primary" fontWeight={700}>
              BroadbandConnect
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            Save Money on Business Broadband
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Tell us about your current broadband and a specialist will find you
            a better deal.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate("/apply")}
          >
            Get a Better Deal →
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 3, display: "block" }}
          >
            Free service. No commitment. Expert advice.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
