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
  Button, 
  IconButton, 
  CircularProgress,
  Tooltip,
  Chip,
  useTheme
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  ShoppingBag as OrderIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';

const RecentOrders = ({ orders = [], loading = false, onRefresh }) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
      case 'payment_pending':
        return theme.palette.warning.main;
      case 'in_progress':
      case 'approved':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      case 'review':
      case 'revision':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'payment_pending': return 'Payment Pending';
      case 'in_progress': return 'In Progress';
      case 'approved': return 'Approved';
      case 'completed': return 'Completed';
      case 'review': return 'In Review';
      case 'revision': return 'In Revision';
      case 'final_payment': return 'Final Payment';
      default: return status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Recent Orders
        </Typography>
        <Box>
          <Tooltip title="Refresh orders">
            <IconButton 
              size="small" 
              onClick={onRefresh}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          <Button 
            component={Link} 
            to="/dashboard/user/orders" 
            variant="text" 
            color="primary" 
            size="small"
            sx={{ ml: 1 }}
          >
            View All
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {orders.length > 0 ? (
        <List sx={{ py: 0 }}>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              <ListItem 
                component={Link}
                to={`/dashboard/user/orders?id=${order._id}`}
                sx={{ 
                  px: 2, 
                  py: 1.5,
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getStatusColor(order.status) }}>
                    <OrderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Typography 
                        variant="body1" 
                        component="span" 
                        fontWeight="medium"
                        sx={{ mr: 1 }}
                      >
                        {order.title}
                      </Typography>
                      <Chip 
                        label={getStatusLabel(order.status)}
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(order.status),
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(order.price)} • Created {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
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
            No orders found. Start by creating a new order!
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            component="a"
            href="/services"
            sx={{ mt: 2 }}
          >
            Browse Services
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default RecentOrders; 