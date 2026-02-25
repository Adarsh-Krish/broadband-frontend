import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  AppBar,
  Toolbar,
  Divider,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import BoltIcon from "@mui/icons-material/Bolt";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const packages = [
  {
    id: 1,
    provider: "BT Business",
    download: 80,
    upload: 20,
    price: 39.99,
    contract: 24,
    badge: null,
    color: "#e8f4fd",
    borderColor: "#1976d2",
  },
  {
    id: 2,
    provider: "Virgin Business",
    download: 300,
    upload: 50,
    price: 55.99,
    contract: 24,
    badge: "Best Value",
    color: "#fff8e1",
    borderColor: "#f9a825",
  },
  {
    id: 3,
    provider: "CityFibre",
    download: 900,
    upload: 900,
    price: 65.99,
    contract: 12,
    badge: "Fastest",
    color: "#f3e5f5",
    borderColor: "#7b1fa2",
  },
];

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const postcode = location.state?.postcode || "Unknown";

  const handleSelect = (pkg) => {
    navigate("/apply", { state: { postcode, package: pkg } });
  };

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
            onClick={() => navigate("/")}
            size="small"
          >
            Change Postcode
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
        {/* Heading */}
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Available Packages
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Showing results for postcode: <strong>{postcode}</strong>
        </Typography>

        {/* Package Cards */}
        <Grid container spacing={3}>
          {packages.map((pkg) => (
            <Grid item xs={12} md={4} key={pkg.id}>
              <Card
                sx={{
                  height: "100%",
                  border: `2px solid ${pkg.borderColor}`,
                  backgroundColor: pkg.color,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                  position: "relative",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Badge */}
                  {pkg.badge && (
                    <Chip
                      label={pkg.badge}
                      size="small"
                      icon={
                        pkg.badge === "Fastest" ? <BoltIcon /> : <StarIcon />
                      }
                      color={pkg.badge === "Fastest" ? "secondary" : "warning"}
                      sx={{ mb: 2, fontWeight: 700 }}
                    />
                  )}

                  {/* Provider */}
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {pkg.provider}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Speed */}
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Download
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {pkg.download} Mbps
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Upload
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {pkg.upload} Mbps
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Price */}
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="primary"
                    gutterBottom
                  >
                    £{pkg.price}
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {" "}
                      /mo
                    </Typography>
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {pkg.contract} month contract
                  </Typography>

                  {/* CTA */}
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => handleSelect(pkg)}
                    sx={{ backgroundColor: pkg.borderColor }}
                  >
                    Get Connected
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer note */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 4, display: "block", textAlign: "center" }}
        >
          Prices shown are indicative. A broadband expert will confirm exact
          pricing for your area.
        </Typography>
      </Box>
    </Box>
  );
}
