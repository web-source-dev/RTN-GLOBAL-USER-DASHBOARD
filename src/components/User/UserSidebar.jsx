import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SupportIcon from '@mui/icons-material/Support';
import WorkIcon from '@mui/icons-material/Work';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
const UserSidebar = ({ onMobileClose }) => {
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { text: 'Support Tickets', icon: <SupportIcon />, path: '/dashboard/user/support' },
    { text: 'Job Applications', icon: <WorkIcon />, path: '/dashboard/user/applications' },
    { text: 'Consultations', icon: <EventNoteIcon />, path: '/dashboard/user/consultations' },
    { text: 'Orders', icon: <ShoppingCartIcon />, path: '/dashboard/user/orders' },
  ];

  const handleClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={handleClick}
            sx={{
              borderRadius: 2,
              mb: 1,
              mx: 1,
              position: 'relative',
              '&.Mui-selected': {
                backgroundColor: `${theme.palette.primary.main}15`,
                color: theme.palette.primary.main,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  left: -8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: '60%',
                  width: 4,
                  bgcolor: theme.palette.primary.main,
                  borderRadius: '0 4px 4px 0',
                },
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                }
              },
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}10`,
                color: theme.palette.primary.main,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                }
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: location.pathname === item.path
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              sx={{
                color: location.pathname === item.path
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              }}
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: location.pathname === item.path ? 600 : 500
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserSidebar;