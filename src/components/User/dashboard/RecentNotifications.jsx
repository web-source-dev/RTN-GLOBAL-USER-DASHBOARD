import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  IconButton, 
  CircularProgress,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  ShoppingBag as OrderIcon,
  Message as MessageIcon, 
  Headset as SupportIcon,
  Assignment as ConsultationIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Notifications as NotificationIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  EventNote as EventNoteIcon,
  MonetizationOn as MoneyIcon,
  RateReview as RateReviewIcon,
  Build as BuildIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const RecentNotifications = ({ notifications = [], loading = false, onRefresh }) => {
  const theme = useTheme();

  const getNotificationIcon = (notification) => {
    if (!notification || !notification.title) return <InfoIcon />;

    const title = notification.title.toLowerCase();
    
    if (title.includes('payment') || title.includes('tip')) {
      return <MoneyIcon color="success" />;
    } else if (title.includes('review')) {
      return <RateReviewIcon color="primary" />;
    } else if (title.includes('revision')) {
      return <BuildIcon color="warning" />;
    } else if (title.includes('offer')) {
      return <ShoppingCartIcon color="primary" />;
    } else if (title.includes('status')) {
      return <InfoIcon color="info" />;
    } else if (title.includes('invoice') || title.includes('receipt')) {
      return <ReceiptIcon color="primary" />;
    }

    switch (notification.type) {
      case 'system':
        return <InfoIcon color="info" />;
      case 'support':
        return <SupportIcon color="warning" />;
      case 'message':
        return <EmailIcon color="primary" />;
      case 'consultation':
        return <EventNoteIcon color="success" />;
      case 'info':
        return <InfoIcon color="info" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <NotificationIcon />;
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Recent Notifications
        </Typography>
        <Box>
          <Tooltip title="Refresh notifications">
            <IconButton 
              size="small" 
              onClick={onRefresh}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {notifications.length > 0 ? (
        <List sx={{ py: 0 }}>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem sx={{ px: 2, py: 1.5 }}>
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: notification.read 
                        ? theme.palette.grey[300] 
                        : theme.palette.primary.main 
                    }}
                  >
                    {getNotificationIcon(notification)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Typography 
                      variant="body2" 
                      component="span" 
                      fontWeight={notification.read ? "regular" : "medium"}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No notifications yet. We'll notify you of important updates.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default RecentNotifications;
