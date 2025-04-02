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
  Chip,
  CircularProgress,
  Tooltip,
  IconButton,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Headset as SupportIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '@mui/material/styles';

const RecentSupportTickets = ({ tickets, loading, onRefresh }) => {
  const theme = useTheme();

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return theme.palette.error.main;
      case 'High': return theme.palette.warning.main;
      case 'Medium': return theme.palette.info.main;
      case 'Low': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return theme.palette.warning.main;
      case 'In Progress': return theme.palette.info.main;
      case 'Resolved': return theme.palette.success.main;
      case 'Closed': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Recent Support Tickets
        </Typography>
        <Box>
          <Tooltip title="Refresh tickets">
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
            to="/dashboard/user/support" 
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
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={30} />
        </Box>
      ) : tickets && tickets.length > 0 ? (
        <List sx={{ py: 0 }}>
          {tickets.map((ticket) => (
            <React.Fragment key={ticket._id}>
              <ListItem 
                component={Link}
                to={`/dashboard/user/support?id=${ticket._id}`}
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
                  <Avatar sx={{ bgcolor: getStatusColor(ticket.status) }}>
                    <SupportIcon />
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
                        {ticket.subject}
                      </Typography>
                      <Chip 
                        label={ticket.status}
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(ticket.status),
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                      <Chip 
                        label={ticket.priority}
                        size="small"
                        sx={{ 
                          backgroundColor: getPriorityColor(ticket.priority),
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {ticket.issueCategory} • #{ticket.ticketNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
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
            No support tickets yet. Need help?
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            component={Link}
            to="/dashboard/user/support"
            sx={{ mt: 2 }}
          >
            Create Support Ticket
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default RecentSupportTickets; 