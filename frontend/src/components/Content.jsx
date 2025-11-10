import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

function Content() {
  return (
    <Box sx={{ bgcolor: "#0e1117", minHeight: "100vh", color: "white" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1f2937 0%, #0f172a 100%)",
          color: "white",
          py: 14,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: "linear-gradient(90deg, #facc15, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Empower Your University
          </Typography>
          <Typography variant="h5" sx={{ mb: 5, color: "#cbd5e1" }}>
            Smart, modern, and fully integrated campus management platform
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#facc15",
                color: "#0f172a",
                fontWeight: 700,
                px: 4,
                "&:hover": { bgcolor: "#eab308" },
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "#22d3ee",
                color: "#22d3ee",
                px: 4,
                "&:hover": { bgcolor: "rgba(34,211,238,0.1)" },
              }}
            >
              Watch Demo
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 1 }}>
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            p: 4,
            bgcolor: "#1e293b",
            color: "white",
          }}
        >
          <Grid container spacing={3}>
            {[
              { number: "500+", label: "Universities" },
              { number: "100K+", label: "Students" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 800, color: "#facc15" }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#94a3b8" }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h3"
          textAlign="center"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: "linear-gradient(90deg, #facc15, #22d3ee)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Core Features
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ mb: 6, color: "#94a3b8" }}
        >
          Everything you need to power your academic ecosystem
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: <PeopleIcon sx={{ fontSize: 50, color: "#22d3ee" }} />,
              title: "Student Management",
              desc: "Handle admissions, profiles, attendance, and performance easily.",
            },
            {
              icon: <CalendarTodayIcon sx={{ fontSize: 50, color: "#facc15" }} />,
              title: "Smart Scheduling",
              desc: "Automated class and exam timetables with conflict detection.",
            },
            {
              icon: <AssessmentIcon sx={{ fontSize: 50, color: "#4ade80" }} />,
              title: "Reports & Analytics",
              desc: "Get real-time performance and progress insights.",
            },
            {
              icon: <SchoolIcon sx={{ fontSize: 50, color: "#a78bfa" }} />,
              title: "Course Management",
              desc: "Create, update, and monitor all academic programs efficiently.",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "#1e293b",
                  color: "white",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#94a3b8" }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          py: 10,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: "#facc15",
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: "#94a3b8" }}>
            Join 500+ institutions using UniManage Pro today
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#22d3ee",
              color: "#0f172a",
              fontWeight: 700,
              px: 5,
              py: 2,
              fontSize: "1.1rem",
              "&:hover": { bgcolor: "#0ea5e9" },
            }}
          >
            Start Free Trial
          </Button>
          <Typography sx={{ mt: 3, fontSize: "0.9rem", color: "#64748b" }}>
            No credit card required • 30-day free trial
          </Typography>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#020617", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <SchoolIcon sx={{ mr: 1, color: "#facc15" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  UniManage Pro
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Modern ERP built for education excellence.
              </Typography>
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Product
              </Typography>
              {["Features", "Pricing", "Demo", "Support"].map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  sx={{ color: "#94a3b8", cursor: "pointer", mb: 0.5 }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Company
              </Typography>
              {["About", "Careers", "Contact"].map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  sx={{ color: "#94a3b8", cursor: "pointer", mb: 0.5 }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>
          </Grid>
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              mt: 4,
              pt: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "#475569" }}>
              © 2025 UniManage Pro. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Content;
