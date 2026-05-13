import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
  Avatar,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PeopleIcon from "@mui/icons-material/People";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  loginThunk,
  registerThunk,
  clearError,
} from "../../features/auth/authSlice";

const Auth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useAppSelector((s) => s.auth);
  const [tab, setTab] = useState(0);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(clearError());
      setForm((p) => ({ ...p, [field]: e.target.value }));
    };

  const handleSubmit = () => {
    if (tab === 0)
      dispatch(loginThunk({ email: form.email, password: form.password }));
    else
      dispatch(
        registerThunk({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        p: 2,
      }}
    >
      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          color="inherit"
        >
          Back
        </Button>
      </Box>
      <Container maxWidth="xs">
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              mx: "auto",
              mb: 1.5,
              width: 52,
              height: 52,
            }}
          >
            <PeopleIcon />
          </Avatar>
          <Typography variant="h5" fontWeight={900}>
            SocialHub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect with people around the world
          </Typography>
        </Box>
        <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => {
              setTab(v);
              dispatch(clearError());
            }}
            variant="fullWidth"
            sx={{
              mb: 3,
              "& .Mui-selected": { color: "primary.main" },
              "& .MuiTabs-indicator": { backgroundColor: "primary.main" },
              "& .MuiTab-root": { textTransform: "none", fontWeight: 700 },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          {/* Demo hint */}
          {tab === 0 && (
            <Alert
              severity="info"
              sx={{ mb: 2, borderRadius: 2, fontSize: 12 }}
            >
              Demo: <strong>alex@demo.com</strong> / password:{" "}
              <strong>password</strong>
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          >
            {tab === 1 && (
              <TextField
                label="Full Name"
                value={form.name}
                onChange={handleChange("name")}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={handleChange("password")}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPwd(!showPwd)}
                      size="small"
                    >
                      {showPwd ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isLoading}
              fullWidth
              sx={{ borderRadius: 8, py: 1.3, fontWeight: 700 }}
            >
              {isLoading
                ? "Loading..."
                : tab === 0
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="center"
            mt={2}
          >
            {tab === 0
              ? "Don't have an account? "
              : "Already have an account? "}
            <Box
              component="span"
              sx={{ color: "primary.main", cursor: "pointer", fontWeight: 700 }}
              onClick={() => {
                setTab(tab === 0 ? 1 : 0);
                dispatch(clearError());
              }}
            >
              {tab === 0 ? "Sign Up" : "Sign In"}
            </Box>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Auth;
