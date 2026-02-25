import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";

const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

export default function PostcodePage() {
  const navigate = useNavigate();
  const [postcode, setPostcode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    const trimmed = postcode.trim();
    if (!UK_POSTCODE_REGEX.test(trimmed)) {
      setError("Please enter a valid UK postcode (e.g. SW1A 1AA)");
      return;
    }
    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/results", { state: { postcode: trimmed.toUpperCase() } });
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCheck();
  };

  useEffect(() => {
    console.log("INSIDE POSTCODEPAGE");
  }, []);

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
        <CardContent sx={{ p: 5 }}>
          {/* Logo / Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
            <WifiIcon color="primary" fontSize="large" />
            <Typography variant="h6" color="primary" fontWeight={700}>
              BroadbandConnect
            </Typography>
          </Box>

          {/* Headline */}
          <Typography variant="h4" gutterBottom>
            Find Business Broadband
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Enter your postcode to see available packages in your area.
          </Typography>

          {/* Input */}
          <TextField
            fullWidth
            label="Your Postcode"
            placeholder="e.g. SW1A 1AA"
            value={postcode}
            onChange={(e) => {
              setPostcode(e.target.value.toUpperCase());
              setError("");
            }}
            onKeyDown={handleKeyDown}
            error={!!error}
            helperText={error}
            autoFocus
            inputProps={{ maxLength: 8 }}
            sx={{ mb: 3 }}
          />

          {/* CTA */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleCheck}
            disabled={loading || !postcode}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Check Availability"
            )}
          </Button>

          {/* Trust note */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 3, display: "block", textAlign: "center" }}
          >
            No commitment. A broadband expert will guide you through options.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
