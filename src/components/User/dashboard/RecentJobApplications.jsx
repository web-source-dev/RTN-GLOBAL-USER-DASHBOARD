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
  useTheme
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Work as JobIcon,
  Business as DepartmentIcon,
  WorkOutline as ExperienceIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const RecentJobApplications = ({ applications = [], loading = false, onRefresh }) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
      case 'under_review':
        return theme.palette.warning.main;
      case 'shortlisted':
      case 'interview_scheduled':
        return theme.palette.info.main;
      case 'selected':
      case 'offer_extended':
        return theme.palette.success.main;
      case 'rejected':
      case 'withdrawn':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Unknown';
    
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Recent Job Applications
        </Typography>
        <Box>
          <Tooltip title="Refresh applications">
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
            to="/dashboard/user/applications" 
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

      {applications.length > 0 ? (
        <List sx={{ py: 0 }}>
          {applications.map((application) => (
            <React.Fragment key={application._id}>
              <ListItem 
                component={Link}
                to={`/dashboard/user/applications?id=${application._id}`}
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
                  <Avatar sx={{ bgcolor: getStatusColor(application.status) }}>
                    <JobIcon />
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
                        {application.position}
                      </Typography>
                      <Box 
                        sx={{ 
                          backgroundColor: getStatusColor(application.status),
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          fontWeight: 'medium'
                        }}
                      >
                        {getStatusLabel(application.status)}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DepartmentIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 0.5, fontSize: '0.9rem' }} />
                          <Typography variant="body2" color="text.secondary">
                            {application.department}
                          </Typography>
                        </Box>
                        {application.experienceLevel && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ExperienceIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 0.5, fontSize: '0.9rem' }} />
                            <Typography variant="body2" color="text.secondary">
                              {application.experienceLevel}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
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
            No job applications found. Explore our career opportunities!
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            component={Link}
            to="/careers"
            sx={{ mt: 2 }}
          >
            Browse Jobs
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default RecentJobApplications; 