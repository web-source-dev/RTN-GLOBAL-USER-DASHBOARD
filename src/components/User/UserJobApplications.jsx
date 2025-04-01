import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../BackendAPi/ApiProvider';

const UserJobApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/user/job-applications');
      setApplications(response.data);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error fetching applications' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'info',
      'Reviewing': 'warning',
      'Shortlisted': 'success',
      'Interview': 'primary',
      'Rejected': 'error',
      'Accepted': 'success'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', zIndex: 2 ,p:3}}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium' }}>
        Job Applications
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <TableContainer 
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          '&:hover': {
            boxShadow: 3,
            transition: 'box-shadow 0.3s ease-in-out'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Experience Level</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Applied On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <TableRow 
                  key={application._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transition: 'background-color 0.3s ease-in-out'
                    }
                  }}
                >
                  <TableCell>{application.position}</TableCell>
                  <TableCell>{application.department}</TableCell>
                  <TableCell>{application.experienceLevel}</TableCell>
                  <TableCell>
                    <Chip
                      label={application.applicationStatus}
                      color={getStatusColor(application.applicationStatus)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(application.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserJobApplications;