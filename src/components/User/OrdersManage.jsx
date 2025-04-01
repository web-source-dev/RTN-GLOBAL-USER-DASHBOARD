import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Paper,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  LinearProgress,
  Stack
} from '@mui/material';
import {
  BarChart as ChartIcon,
  ShoppingBag as OrderIcon,
  CheckCircle as CompletedIcon,
  AccessTime as PendingIcon,
  Refresh as RefreshIcon,
  ArrowCircleRight as ArrowRightIcon,
  Timeline as TimelineIcon,
  Receipt as InvoiceIcon,
  ChatBubbleOutline as ChatIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon,
  Build as RevisionIcon,
  Star as RatingIcon,
} from '@mui/icons-material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from '../../contexts/AuthContext';
import { alpha } from '@mui/material/styles';
import API from '../../BackendAPi/ApiProvider';

const OrdersManage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
    avgCompletionTime: 0,
    totalSpent: 0,
    revisionsUsed: 0,
    revisionsPurchased: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get Order Management URL from environment variables
  const ordersManageUrl = process.env.REACT_APP_ORDERS_MANAGE_URL || 'http://manage.mydomain.local:3003';

  // Fetch orders and statistics
  const fetchOrders = async () => {
    console.log('Fetching orders and statistics...');
    setLoading(true);
    setError(null);
    try {
      // Fetch orders and stats from API - catch each request separately
      console.log('Making API requests...');
      
      let ordersData = [];
      let statsData = {};
      
      // Try to get the main orders data
      try {
        const ordersResponse = await API.get(`/api/user/orders`);
        console.log('Orders response:', ordersResponse);
        if (ordersResponse.data && ordersResponse.data.success) {
          ordersData = ordersResponse.data.orders || [];
          setOrders(ordersData);
        } else {
          console.warn('Orders response was not successful', ordersResponse.data);
        }
      } catch (orderErr) {
        console.error('Error fetching orders:', orderErr);
        if (orderErr.response) {
          console.error('Response status:', orderErr.response.status);
          console.error('Response data:', orderErr.response.data);
          
          // If endpoint doesn't exist (404), we'll make a fallback request to the main orders endpoint
          if (orderErr.response.status === 404) {
            try {
              console.log('Attempting fallback request to /api/user/orders');
              const fallbackResponse = await API.get(`/api/user/orders`);
              if (fallbackResponse.data) {
                ordersData = fallbackResponse.data.orders || [];
                setOrders(ordersData);
              }
            } catch (fallbackErr) {
              console.error('Fallback request also failed:', fallbackErr);
            }
          }
        }
      }
      
      // Try to get stats data
      try {
        const statsResponse = await API.get(`/api/user/orders/stats`);
        console.log('Stats response:', statsResponse);
        if (statsResponse.data && statsResponse.data.success) {
          statsData = statsResponse.data.stats || {};
        } else {
          console.warn('Stats response was not successful', statsResponse.data);
        }
      } catch (statsErr) {
        console.error('Error fetching stats:', statsErr);
        if (statsErr.response) {
          console.error('Response status:', statsErr.response.status);
          console.error('Response data:', statsErr.response.data);
          
          // If 404, stats endpoint isn't implemented, calculate from orders
          if (statsErr.response.status === 404 && ordersData.length > 0) {
            console.log('Calculating stats from orders data as fallback');
            
            // Calculate basic stats from orders data
            const activeOrders = ordersData.filter(order => 
              ['approved', 'in_progress', 'review', 'revision', 'final_payment'].includes(order.status)
            );
            const completedOrders = ordersData.filter(order => order.status === 'completed');
            const pendingOrders = ordersData.filter(order => 
              ['pending', 'payment_pending'].includes(order.status)
            );
            
            statsData = {
              total: ordersData.length,
              active: activeOrders.length,
              completed: completedOrders.length,
              pending: pendingOrders.length,
              // Other stats will default to 0
            };
          }
        }
      }

      // Skip the unread-messages request since it's returning 404
      // Just set unreadMessages to 0 for now
      const unreadCount = 0;
      
      // Set stats from the fetched data
      setStats({
        total: statsData.total || ordersData.length || 0,
        active: statsData.active || 0,
        completed: statsData.completed || 0,
        pending: statsData.pending || 0,
        avgCompletionTime: statsData.avgCompletionTime || 0,
        totalSpent: statsData.totalSpent || 0,
        revisionsUsed: statsData.revisionsUsed || 0,
        revisionsPurchased: statsData.revisionsPurchased || 0,
        unreadMessages: unreadCount
      });
      
      console.log('Data fetching complete');
      
      // Only show error if we couldn't get any data at all
      if (ordersData.length === 0 && Object.keys(statsData).length === 0) {
        setError('Could not load any order data. The service might be unavailable.');
      } else {
        setError(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchOrders:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      
      // Check if it's an authentication error
      if (err.response && (
          err.response.status === 401 || 
          (err.response.data && err.response.data.authError)
      )) {
        setError('Your session has expired. Please login again.');
        // Redirect to session expired page after 2 seconds
        setTimeout(() => {
          window.location.href = '/error/session-expired';
        }, 2000);
      } else {
        setError('Failed to load orders. Please try again later.');
      }
      
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch orders immediately on component mount
    fetchOrders();
  }, []); // No dependencies - we only want this to run once on mount

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);
  };

  // Get status chip with appropriate color and icon
  const getStatusChip = (status) => {
    let color, icon, label;
    
    switch (status) {
      case 'pending':
        color = 'warning';
        icon = <PendingIcon fontSize="small" />;
        label = 'Pending';
        break;
      case 'payment_pending':
        color = 'warning';
        icon = <MoneyIcon fontSize="small" />;
        label = 'Payment Pending';
        break;
      case 'approved':
        color = 'success';
        icon = <CheckCircle fontSize="small" />;
        label = 'Approved';
        break;
      case 'in_progress':
        color = 'info';
        icon = <TimelineIcon fontSize="small" />;
        label = 'In Progress';
        break;
      case 'review':
        color = 'info';
        icon = <RatingIcon fontSize="small" />;
        label = 'Review';
        break;
      case 'revision':
        color = 'warning';
        icon = <RevisionIcon fontSize="small" />;
        label = 'Revision';
        break;
      case 'final_payment':
        color = 'warning';
        icon = <MoneyIcon fontSize="small" />;
        label = 'Final Payment';
        break;
      case 'completed':
        color = 'success';
        icon = <CompletedIcon fontSize="small" />;
        label = 'Completed';
        break;
      default:
        color = 'default';
        icon = null;
        label = status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    return (
      <Chip 
        label={label}
        color={color}
        size="small"
        icon={icon}
        sx={{ 
          fontWeight: 'medium',
          borderRadius: '6px',
          '& .MuiChip-label': { px: 1 }
        }}
      />
    );
  };

  // Get progress percentage based on order status
  const getOrderProgress = (status) => {
    const progressMap = {
      'pending': 10,
      'payment_pending': 20,
      'approved': 30,
      'in_progress': 50,
      'review': 80,
      'revision': 70,
      'final_payment': 90,
      'completed': 100
    };
    
    return progressMap[status] || 0;
  };

  // Navigate to order management system
  const goToOrdersManage = (path = '') => {
    window.open(`${ordersManageUrl}${path}`, '_blank');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
            Loading your orders...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header section */}
      <Box mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Orders Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and manage all your orders and progress in one place
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<OrderIcon />}
              onClick={() => goToOrdersManage('/orders')}
              sx={{ borderRadius: '8px' }}
            >
              Go to Orders Manager
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.primary.main, 0.15) 
                : alpha(theme.palette.primary.main, 0.05)
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 40,
                    height: 40
                  }}
                >
                  <OrderIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="medium" ml={1.5}>
                  Total Orders
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.info.main, 0.15) 
                : alpha(theme.palette.info.main, 0.05)
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.info.main,
                    width: 40,
                    height: 40
                  }}
                >
                  <TimelineIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="medium" ml={1.5}>
                  Active Orders
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently in progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.success.main, 0.15) 
                : alpha(theme.palette.success.main, 0.05)
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.success.main,
                    width: 40,
                    height: 40
                  }}
                >
                  <CompletedIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="medium" ml={1.5}>
                  Completed
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {stats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successfully delivered
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              borderRadius: 2,
              height: '100%',
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.warning.main, 0.15) 
                : alpha(theme.palette.warning.main, 0.05)
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.warning.main,
                    width: 40,
                    height: 40
                  }}
                >
                  <PendingIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="medium" ml={1.5}>
                  Pending
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Awaiting action
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Stats */}
      <Grid container spacing={3} mb={4}>

        <Grid item xs={12} md={12}>
          <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={12} md={3}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<OrderIcon />}
                    onClick={() => goToOrdersManage('/orders')}
                    fullWidth
                    sx={{ borderRadius: '8px' }}
                  >
                    View All Orders
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ChatIcon />}
                    onClick={() => goToOrdersManage('/orders/chat')}
                    fullWidth
                    sx={{ borderRadius: '8px', position: 'relative' }}
                  >
                    Message Service Provider
                    {stats.unreadMessages > 0 && (
                      <Chip
                        label={stats.unreadMessages}
                        color="error"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          height: 22,
                          minWidth: 22,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Box mb={4}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Orders
              </Typography>
              <Button
                variant="text"
                endIcon={<ArrowRightIcon />}
                onClick={() => goToOrdersManage('/orders')}
              >
                View All
              </Button>
            </Box>
            
            {!orders || orders.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {!orders ? 'Error loading orders data' : 'You don\'t have any orders yet'}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, borderRadius: '8px' }}
                  onClick={() => goToOrdersManage('/orders')}
                >
                  {!orders ? 'View Orders' : 'Explore Services'}
                </Button>
              </Box>
            ) : (
              <List sx={{ width: '100%' }}>
                {orders.slice(0, 5).map((order) => (
                  <React.Fragment key={order._id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{ 
                        py: 2,
                        px: 1,
                        '&:hover': { 
                          bgcolor: theme.palette.action.hover,
                          borderRadius: 2,
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => goToOrdersManage(`/orders/${order._id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <OrderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {order.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {moment(order.createdAt).format('MMM D, YYYY')}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getStatusChip(order.status)}
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                  {formatPrice(order.price)}
                                </Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  goToOrdersManage(`/orders/chat`);
                                }}
                              >
                                <ChatIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <Box sx={{ width: '100%', mt: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={getOrderProgress(order.status)}
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 4,
                                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                                }}
                              />
                              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                {getOrderProgress(order.status)}% Complete
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* CTA Section */}
      <Box>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: 'white'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Need More Order Management Features?
              </Typography>
              <Typography variant="body1" paragraph>
                Use our full-featured Order Management System to track progress, communicate with admins, download invoices, and more.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                startIcon={<ArrowRightIcon />}
                onClick={() => goToOrdersManage('/orders')}
                sx={{ 
                  py: 1.5, 
                  borderRadius: '8px',
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.9)
                  }
                }}
              >
                Open Order Manager
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default OrdersManage;
