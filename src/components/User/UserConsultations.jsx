import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Link,
  Stack
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CloudDownload as CloudDownloadIcon,
  Payment as PaymentIcon,
  VideoCall as VideoCallIcon,
  Check as CheckIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  HourglassEmpty as PendingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import API from '../../BackendAPi/ApiProvider';

const UserConsultations = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmPayment, setConfirmPayment] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/user/consultations');
      setConsultations(response.data);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error fetching consultations' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setConfirmPayment(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const handlePaymentComplete = async () => {
    if (!selectedConsultation) return;
    
    try {
      setLoading(true);
      await API.post(`/api/admin/consultations/${selectedConsultation._id}/payment-complete`);
      
      // Refresh consultations
      await fetchConsultations();
      
      setMessage({
        type: 'success',
        text: 'Payment recorded successfully. You will receive your meeting details via email.'
      });
      
      handleCloseDetails();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error recording payment'
      });
    } finally {
      setLoading(false);
      setConfirmPayment(false);
    }
  };

  if (loading && consultations.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', zIndex: 2, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'medium' }}>
        My Consultations
      </Typography>
      
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
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
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consultations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No consultations found
                </TableCell>
              </TableRow>
            ) : (
              consultations.map((consultation) => (
                <TableRow 
                  key={consultation._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transition: 'background-color 0.3s ease-in-out'
                    }
                  }}
                >
                  <TableCell>
                    {new Date(consultation.preferredDate).toLocaleString('en-US', {
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{consultation.preferredTime}</TableCell>
                  <TableCell>{consultation.consultationType}</TableCell>
                  <TableCell>
                    <Chip
                      label={consultation.status}
                      color={getStatusColor(consultation.status)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    {consultation.isFirstConsultation ? (
                      <Chip label="Free" color="success" size="small" />
                    ) : (
                      <Chip 
                        label={consultation.paymentCompleted ? "Paid" : `$${consultation.estimatedPrice}`} 
                        color={consultation.paymentCompleted ? "success" : "warning"}
                        size="small" 
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(consultation)}
                        sx={{
                          '&:hover': {
                            color: 'primary.main',
                            backgroundColor: 'primary.lighter'
                          }
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Consultation Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="md"
      >
        {selectedConsultation && (
          <>
            <DialogTitle>
              Consultation Details
              {selectedConsultation.isFirstConsultation ? (
                <Chip 
                  label="Free Consultation" 
                  color="success" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              ) : (
                <Chip 
                  label={`Paid ($${selectedConsultation.estimatedPrice})`} 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              )}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Consultation Details Card */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Date & Time
                      </Typography>
                      
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <CalendarIcon color="action" />
                        <Typography>
                          {new Date(selectedConsultation.preferredDate).toLocaleDateString('en-US', {
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                          })}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <TimeIcon color="action" />
                        <Typography>
                          {selectedConsultation.preferredTime} ({selectedConsultation.duration} minutes)
                        </Typography>
                      </Stack>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="h6" gutterBottom color="primary">
                        Service Details
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Type:</strong> {selectedConsultation.consultationType}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Status:</strong> {selectedConsultation.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Payment & Meeting Information */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Payment Information
                      </Typography>
                      
                      {selectedConsultation.isFirstConsultation ? (
                        <Alert severity="success" icon={<CheckIcon />} sx={{ mb: 2 }}>
                          This is your free consultation. No payment required.
                        </Alert>
                      ) : (
                        <>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Price:</strong> ${selectedConsultation.estimatedPrice}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Status:</strong> {selectedConsultation.paymentCompleted ? 'Paid' : 'Payment Required'}
                          </Typography>
                          
                          {selectedConsultation.paymentCompleted ? (
                            <Alert severity="success" icon={<CheckIcon />} sx={{ mb: 2 }}>
                              Payment completed on {new Date(selectedConsultation.paymentDate).toLocaleDateString()}
                            </Alert>
                          ) : (
                            <Alert severity="warning" icon={<PendingIcon />} sx={{ mb: 2 }}>
                              Payment is required before your consultation date.
                            </Alert>
                          )}
                          
                          {!selectedConsultation.paymentCompleted && selectedConsultation.paymentLink && (
                            <Button 
                              variant="contained" 
                              startIcon={<PaymentIcon />}
                              component="a"
                              href={selectedConsultation.paymentLink}
                              target="_blank"
                              fullWidth
                              sx={{ mb: 2 }}
                            >
                              Go to Payment Page
                            </Button>
                          )}
                          
                          {/* Invoice Download */}
                          {selectedConsultation.invoicePath && (
                            <Button 
                              variant="outlined" 
                              startIcon={<CloudDownloadIcon />}
                              component="a"
                              href={`${process.env.REACT_APP_API_URL}${selectedConsultation.invoicePath}`}
                              target="_blank"
                              fullWidth
                              sx={{ mb: 2 }}
                            >
                              Download Invoice
                            </Button>
                          )}
                          
                          {/* Payment Receipt Download (only show if payment is completed) */}
                          {selectedConsultation.paymentCompleted && selectedConsultation.paymentReceiptPath && (
                            <Button 
                              variant="contained" 
                              color="success"
                              startIcon={<CloudDownloadIcon />}
                              component="a"
                              href={`${process.env.REACT_APP_API_URL}${selectedConsultation.paymentReceiptPath}`}
                              target="_blank"
                              fullWidth
                              sx={{ mb: 2 }}
                            >
                              Download Payment Receipt
                            </Button>
                          )}
                          
                          {/* Mark as Paid Button (for simulation) */}
                          {!selectedConsultation.paymentCompleted && selectedConsultation.status === 'confirmed' && (
                            <Button 
                              variant="contained" 
                              color="primary"
                              startIcon={<PaymentIcon />}
                              onClick={() => {
                                handleCloseDetails();
                                navigate(`/payment/${selectedConsultation._id}`);
                              }}
                              fullWidth
                              sx={{ mb: 2 }}
                            >
                              Proceed to Payment
                            </Button>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Meeting Link (Only show if free or paid) */}
                {(selectedConsultation.isFirstConsultation || selectedConsultation.paymentCompleted) && 
                  selectedConsultation.meetingLink && 
                  selectedConsultation.status === 'confirmed' && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ bgcolor: 'success.lighter' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                          Meeting Details
                        </Typography>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Click the button below to join your consultation at the scheduled time.
                        </Alert>
                        <Button 
                          variant="contained" 
                          color="success"
                          startIcon={<VideoCallIcon />}
                          component="a"
                          href={selectedConsultation.meetingLink}
                          target="_blank"
                          fullWidth
                        >
                          Join Meeting
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {/* Notes or Message section */}
                {selectedConsultation.message && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                          Your Notes
                        </Typography>
                        <Typography variant="body1">
                          {selectedConsultation.message}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {/* Additional info card */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: 'info.lighter' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Preparation Tips
                      </Typography>
                      <Typography variant="body2" paragraph>
                        To make the most of your consultation:
                      </Typography>
                      <ul>
                        <li><Typography variant="body2">Prepare specific questions you'd like to discuss</Typography></li>
                        <li><Typography variant="body2">Have any relevant documents ready to share</Typography></li>
                        <li><Typography variant="body2">Test your audio and video before the meeting</Typography></li>
                        <li><Typography variant="body2">Join from a quiet location with good internet connection</Typography></li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails} color="primary">
                Close
              </Button>
            </DialogActions>
            
            {/* Payment Confirmation Dialog */}
            <Dialog
              open={confirmPayment}
              onClose={() => setConfirmPayment(false)}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle>Confirm Payment</DialogTitle>
              <DialogContent>
                <Typography>
                  Please confirm that you have completed the payment of ${selectedConsultation.estimatedPrice} for your consultation.
                </Typography>
                <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                  Note: This is for demonstration purposes. In a real system, payment confirmation would be handled automatically by the payment processor.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setConfirmPayment(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handlePaymentComplete} 
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
                >
                  Confirm Payment
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default UserConsultations;