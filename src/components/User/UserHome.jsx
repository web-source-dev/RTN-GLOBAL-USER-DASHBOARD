import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider,
  Grid, 
  Skeleton,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag as OrderIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';
import API from '../../BackendAPi/ApiProvider';

// Import custom components
import DashboardStats from './dashboard/DashboardStats';
import RecentOrders from './dashboard/RecentOrders';
import RecentSupportTickets from './dashboard/RecentSupportTickets';
import RecentConsultations from './dashboard/RecentConsultations';
import RecentJobApplications from './dashboard/RecentJobApplications';
import RecentNotifications from './dashboard/RecentNotifications';

const UserHome = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [refreshing, setRefreshing] = useState({
    orders: false,
    notifications: false,
    support: false,
    consultations: false,
    applications: false
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch data in parallel
        const [orderStatsRes, ordersRes, notificationsRes, supportRes, consultationsRes, applicationsRes] = await Promise.all([
          API.get('/api/user/orders/stats'),
          API.get('/api/user/orders'),
          API.get('/api/user/notifications'),
          API.get('/api/user/support-tickets'),
          API.get('/api/user/consultations'),
          API.get('/api/user/job-applications')
        ]);

        setOrderStats(orderStatsRes.data.stats);
        setRecentOrders(ordersRes.data.orders?.slice(0, 5) || []);
        setRecentNotifications(notificationsRes.data?.slice(0, 3) || []);
        setSupportTickets(supportRes.data?.slice(0, 3) || []);
        setConsultations(consultationsRes.data?.slice(0, 3) || []);
        setJobApplications(applicationsRes.data?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshData = async (dataType) => {
    setRefreshing({...refreshing, [dataType]: true});
    try {
      switch(dataType) {
        case 'orders':
          const orderRes = await API.get('/api/user/orders');
          setRecentOrders(orderRes.data.orders?.slice(0, 5) || []);
          const statsRes = await API.get('/api/user/orders/stats');
          setOrderStats(statsRes.data.stats);
          break;
        case 'notifications':
          const notifRes = await API.get('/api/user/notifications');
          setRecentNotifications(notifRes.data?.slice(0, 3) || []);
          break;
        case 'support':
          const supportRes = await API.get('/api/user/support-tickets');
          setSupportTickets(supportRes.data?.slice(0, 3) || []);
          break;
        case 'consultations':
          const consultRes = await API.get('/api/user/consultations');
          setConsultations(consultRes.data?.slice(0, 3) || []);
          break;
        case 'applications':
          const appRes = await API.get('/api/user/job-applications');
          setJobApplications(appRes.data?.slice(0, 3) || []);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error refreshing ${dataType}:`, error);
    } finally {
      setRefreshing({...refreshing, [dataType]: false});
    }
  };

  // Render loading skeletons
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {/* Stats skeletons */}
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
          
          {/* Main content skeletons */}
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 3 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Dashboard Overview
        </Typography>
        <Box>
          <Button 
            component={Link} 
            to="/dashboard/user/profile"
            variant="outlined" 
            color="primary"
            startIcon={<ProfileIcon />}
            sx={{ mr: 2 }}
          >
            My Profile
          </Button>
          <Button 
            component={Link} 
            to="/dashboard/user/orders"
            variant="contained" 
            color="primary"
            startIcon={<OrderIcon />}
          >
            Manage Orders
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Stats Cards Component */}
      <DashboardStats stats={orderStats} />
      
      {/* Main Dashboard Content - First Row */}
      <Grid container spacing={3}>
        {/* Recent Orders component */}
        <Grid item xs={12} md={6}>
          <RecentOrders 
            orders={recentOrders} 
            loading={refreshing.orders}
            onRefresh={() => refreshData('orders')}
          />
        </Grid>
        
        {/* Recent Notifications component */}
        <Grid item xs={12} md={6}>
          <RecentNotifications 
            notifications={recentNotifications} 
            loading={refreshing.notifications}
            onRefresh={() => refreshData('notifications')}
          />
        </Grid>
      </Grid>
      
      {/* Main Dashboard Content - Second Row */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Support Tickets component */}
        <Grid item xs={12} md={6}>
          <RecentSupportTickets 
            tickets={supportTickets} 
            loading={refreshing.support}
            onRefresh={() => refreshData('support')}
          />
        </Grid>
        
        {/* Consultations component */}
        <Grid item xs={12} md={6}>
          <RecentConsultations
            consultations={consultations}
            loading={refreshing.consultations}
            onRefresh={() => refreshData('consultations')}
          />
        </Grid>
        
        {/* Job Applications component */}
        <Grid item xs={12} md={12}>
          <RecentJobApplications
            applications={jobApplications}
            loading={refreshing.applications}
            onRefresh={() => refreshData('applications')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserHome; 