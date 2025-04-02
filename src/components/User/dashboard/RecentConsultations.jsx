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
  EventNote as ConsultationIcon,
  Event as DateIcon,
  AccessTime as TimeIcon,
  HelpOutline as TypeIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';

const RecentConsultations = ({ consultations = [], loading = false, onRefresh }) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'scheduled':
        return theme.palette.success.main;
      case 'pending':
        return theme.palette.warning.main;
      case 'completed':
        return theme.palette.info.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const formatConsultationType = (type) => {
    if (!type) return 'General';
    
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
          Recent Consultations
        </Typography>
        <Box>
          <Tooltip title="Refresh consultations">
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
            to="/dashboard/user/consultations" 
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

      {consultations.length > 0 ? (
        <List sx={{ py: 0 }}>
          {consultations.map((consultation) => (
            <React.Fragment key={consultation._id}>
              <ListItem 
                component={Link}
                to={`/dashboard/user/consultations?id=${consultation._id}`}
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
                  <Avatar sx={{ bgcolor: getStatusColor(consultation.status) }}>
                    <ConsultationIcon />
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
                        {formatConsultationType(consultation.consultationType)}
                      </Typography>
                      <Box 
                        sx={{ 
                          backgroundColor: getStatusColor(consultation.status),
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          fontWeight: 'medium'
                        }}
                      >
                        {getStatusLabel(consultation.status)}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DateIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 0.5, fontSize: '0.9rem' }} />
                          <Typography variant="body2" color="text.secondary">
                            {consultation.preferredDate && format(new Date(consultation.preferredDate), 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimeIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 0.5, fontSize: '0.9rem' }} />
                          <Typography variant="body2" color="text.secondary">
                            {consultation.preferredTime}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {formatDistanceToNow(new Date(consultation.createdAt), { addSuffix: true })}
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
            No consultations found. Schedule a consultation to get expert advice.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            component={Link}
            to="/consultations"
            sx={{ mt: 2 }}
          >
            Schedule Consultation
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default RecentConsultations; 