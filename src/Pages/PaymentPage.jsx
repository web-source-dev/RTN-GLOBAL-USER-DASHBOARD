import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { 
  Payment as PaymentIcon, 
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  EventAvailable as EventAvailableIcon
} from '@mui/icons-material';
import API from '../BackendAPi/ApiProvider';

// Load Stripe with public key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const PaymentForm = ({ consultation, clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${consultation.firstName} ${consultation.lastName}`,
            email: consultation.email
          }
        }
      });
      
      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        
        // Call our backend to record payment
        await API.post('/api/payments/confirm-payment', {
          consultationId: consultation._id,
          paymentIntentId: result.paymentIntent.id
        });
        
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing your payment.');
    } finally {
      setLoading(false);
    }
  };
  
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <CardElement options={cardElementOptions} />
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {succeeded ? (
        <Alert 
          icon={<CheckCircleIcon fontSize="inherit" />}
          severity="success"
          sx={{ mb: 3 }}
        >
          Payment successful! You will receive the meeting details via email.
        </Alert>
      ) : (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!stripe || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
          sx={{ py: 1.5 }}
        >
          {loading ? 'Processing...' : `Pay $${(consultation.estimatedPrice * 1.1).toFixed(2)}`}
        </Button>
      )}
      
      {succeeded && (
        <Button 
          variant="outlined" 
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/dashboard/user/consultations')}
        >
          Return to Consultations
        </Button>
      )}
    </form>
  );
};

// Main Payment Page
const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  
  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        // First get the consultation details
        const response = await API.get(`/api/user/consultations/${id}`);
        setConsultation(response.data);
        
        // Check if payment is already completed
        if (response.data.paymentCompleted) {
          setPaymentSuccess(true);
          setActiveStep(3);
          return;
        }
        
        // Create payment intent
        const paymentResponse = await API.post('/api/payments/create-payment-intent', {
          consultationId: id
        });
        
        setClientSecret(paymentResponse.data.clientSecret);
      } catch (err) {
        console.error('Error fetching consultation for payment:', err);
        setError(err.response?.data?.message || 'Error loading payment details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsultation();
  }, [id]);
  
  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setActiveStep(3);
  };
  
  // Add a tax calculation function
  const calculateTax = (price) => {
    const basePrice = parseFloat(price) || 0;
    const taxRate = 0.10; // 10% tax
    const taxAmount = basePrice * taxRate;
    const totalAmount = basePrice + taxAmount;
    
    return {
      basePrice,
      taxAmount,
      totalAmount
    };
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading payment details...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained"
          onClick={() => navigate('/dashboard/user/consultations')}
        >
          Return to Consultations
        </Button>
      </Container>
    );
  }
  
  if (!consultation) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Consultation not found
        </Alert>
        <Button 
          variant="contained"
          onClick={() => navigate('/dashboard/user/consultations')}
        >
          Return to Consultations
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Consultation Payment
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          <Step key="book">
            <StepLabel>Book Consultation</StepLabel>
          </Step>
          <Step key="payment">
            <StepLabel>Make Payment</StepLabel>
          </Step>
          <Step key="confirmation">
            <StepLabel>Receive Confirmation</StepLabel>
          </Step>
        </Stepper>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Consultation Details
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Consultation Type" 
                      secondary={consultation.consultationType} 
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText 
                      primary="Date & Time" 
                      secondary={`${new Date(consultation.preferredDate).toLocaleDateString()} at ${consultation.preferredTime}`} 
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText 
                      primary="Duration" 
                      secondary={`${consultation.duration} minutes`} 
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText 
                      primary="Base Price" 
                      secondary={`$${consultation.estimatedPrice.toFixed(2)}`}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText 
                      primary="Tax (10%)" 
                      secondary={`$${(consultation.estimatedPrice * 0.1).toFixed(2)}`}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText 
                      primary="Total Price" 
                      secondary={`$${(consultation.estimatedPrice * 1.1).toFixed(2)}`}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                      secondaryTypographyProps={{ 
                        color: 'primary.main', 
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
            
            <Typography variant="h6" gutterBottom>
              What's Included
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary={`${consultation.duration}-minute consultation with an expert`}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Personalized recommendations and action plan"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Follow-up resources via email"
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {paymentSuccess ? 'Payment Complete' : 'Payment Information'}
            </Typography>
            
            {paymentSuccess ? (
              <Box>
                <Alert 
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ mb: 3 }}
                >
                  Your payment was successful!
                </Alert>
                
                <Card variant="outlined" sx={{ mb: 3, bgcolor: 'success.lighter' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <EventAvailableIcon sx={{ mr: 1 }} /> Next Steps
                    </Typography>
                    <Typography variant="body1" paragraph>
                      You will receive an email with your meeting details soon.
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Please make sure to join the meeting at the scheduled time.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<ReceiptIcon />}
                      component="a"
                      href={`${process.env.REACT_APP_API_URL}${consultation.invoicePath}`}
                      target="_blank"
                      sx={{ mt: 2 }}
                    >
                      Download Invoice
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => navigate('/dashboard/user/consultations')}
                      sx={{ mt: 2 }}
                    >
                      View All Consultations
                    </Button>
                  </CardContent>
                </Card>

                {consultation.paymentReceiptPath && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Your Documents
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          startIcon={<ReceiptIcon />}
                          component="a"
                          href={`${process.env.REACT_APP_API_URL}${consultation.paymentReceiptPath}`}
                          target="_blank"
                        >
                          Download Receipt
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          startIcon={<ReceiptIcon />}
                          component="a"
                          href={`${process.env.REACT_APP_API_URL}${consultation.invoicePath}`}
                          target="_blank"
                        >
                          Download Invoice
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            ) : (
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <PaymentForm 
                        consultation={consultation}
                        clientSecret={clientSecret}
                        onSuccess={handlePaymentSuccess}
                      />
                    </Elements>
                  )}
                  
                  <Box sx={{ mt: 3 }}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        This is a secure payment. Your card details are encrypted.
                      </Typography>
                    </Alert>
                    <Typography variant="caption" color="text.secondary">
                      By proceeding with payment, you agree to our terms and conditions.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PaymentPage; 