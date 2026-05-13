import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Box,
  Avatar, Menu, MenuItem, Divider, Tooltip, Container,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { toggleDarkMode } from '../../features/ui/uiSlice';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(s => s.auth.user);
  const dark = useAppSelector(s => s.ui.darkMode);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
    setAnchor(null);
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{
      backgroundColor: dark ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(16px)',
      borderBottom: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
      color: 'text.primary',
    }}>
      <Container maxWidth="md">
        <Toolbar sx={{ px: { xs: 0 }, gap: 1 }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', mr: 'auto' }}>
            <PeopleIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={900} color="text.primary">SocialHub</Typography>
          </Box>

          <Tooltip title="Feed"><IconButton component={Link} to="/" sx={{ color: 'text.secondary' }}><HomeIcon /></IconButton></Tooltip>
          <Tooltip title="Toggle theme"><IconButton onClick={() => dispatch(toggleDarkMode())} sx={{ color: 'text.secondary' }}>{dark ? <LightModeIcon /> : <DarkModeIcon />}</IconButton></Tooltip>

          {user ? (
            <>
              <Avatar src={user.avatar} onClick={e => setAnchor(e.currentTarget)}
                sx={{ width: 34, height: 34, cursor: 'pointer', border: '2px solid', borderColor: 'primary.main' }}>
                {user.name[0]}
              </Avatar>
              <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
                PaperProps={{ sx: { borderRadius: 2, minWidth: 180, mt: 1 } }}>
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { navigate(`/profile/${user.id}`); setAnchor(null); }}>
                  <PersonIcon fontSize="small" sx={{ mr: 1.5 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box component={Link} to="/auth" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              Sign In
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
