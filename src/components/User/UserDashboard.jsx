import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  useTheme, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Avatar, 
  Drawer, 
  CircularProgress,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import UserSidebar from './UserSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import NotificationComponent from '../notifications/NotificationComponent';
import { useAuth } from '../../contexts/AuthContext';


const UserDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { user, loading, logout } = useAuth();

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfileClick = () => {
    navigate('/dashboard/user/profile');
    handleProfileMenuClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/auth/login`;
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleProfileMenuClose();
  };

  const handleLogoClick = () => {
    navigate('/dashboard/user');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          bgcolor: 'background.paper',
          borderRight: `1px solid ${theme.palette.divider}`,
          position: 'fixed',
          height: '100vh',
          overflowX: 'hidden',
          overflowY: 'auto',
          boxShadow: theme.shadows[1],
          zIndex: theme.zIndex.appBar - 1,
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            borderBottom: `1px solid ${theme.palette.divider}`,
            cursor: 'pointer'
          }}
          onClick={handleLogoClick}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            RTN Global
          </Typography>
        </Box>
        <UserSidebar onMobileClose={handleDrawerToggle} />
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600, 
              color: theme.palette.primary.main,
              cursor: 'pointer'
            }}
            onClick={() => {
              handleLogoClick();
              handleDrawerToggle();
            }}
          >
            RTN Global
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <UserSidebar onMobileClose={handleDrawerToggle} />
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: { md: '280px' } }}>
        {/* Header */}
        <AppBar 
          position="fixed" 
          color="inherit"
          elevation={1}
          sx={{ 
            ml: { md: '280px' },
            width: { md: `calc(100% - 280px)` },
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />
            
            <IconButton sx={{ mx: 1 }}>
              <NotificationComponent />
            </IconButton>
            <IconButton 
              onClick={handleProfileMenuOpen}
              size="small"
            >
              <Avatar 
                src={user?.avatar ? `${process.env.REACT_APP_API_URL}${user.avatar}` : undefined}
                alt={user?.firstName || 'User'}
                sx={{ bgcolor: theme.palette.primary.main }}
              >
                {user?.firstName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>

            {/* User Profile Menu */}
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  width: 250,
                  '& .MuiMenu-list': {
                    padding: '8px 0',
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1, pb: 0 }}>
                <Typography variant="subtitle1" noWrap fontWeight="bold">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }} noWrap>
                  {user?.email}
                </Typography>
              </Box>
              
              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{mt: 8 }}>
          <Paper
            elevation={0}
            sx={{
              minHeight: '60vh',
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;