import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  LinearProgress,
  useTheme
} from '@mui/material';
import { 
  ShoppingBag as OrderIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const DashboardStats = ({ stats }) => {
  const theme = useTheme();

  if (!stats) {
    return null;
  }

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Active Orders */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          height: '100%',
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 2
        }}>
          <CardContent sx={{ position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <OrderIcon />
            </Box>
            <Typography variant="h5" sx={{ mt: 1 }}>
              {stats.active || 0}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Active Orders
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <LinearProgress 
                variant="determinate" 
                value={(stats.active / (stats.total || 1)) * 100}
                sx={{ 
                  width: '100%', 
                  mr: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
              <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                {stats.active} of {stats.total}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Completed Orders */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          height: '100%',
          background: `linear-gradient(45deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 2
        }}>
          <CardContent sx={{ position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CompletedIcon />
            </Box>
            <Typography variant="h5" sx={{ mt: 1 }}>
              {stats.completed || 0}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Completed Orders
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <LinearProgress 
                variant="determinate" 
                value={(stats.completed / (stats.total || 1)) * 100}
                sx={{ 
                  width: '100%', 
                  mr: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
              <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                {stats.completed} of {stats.total}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Pending Orders */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          height: '100%',
          background: `linear-gradient(45deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`,
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 2
        }}>
          <CardContent sx={{ position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PendingIcon />
            </Box>
            <Typography variant="h5" sx={{ mt: 1 }}>
              {stats.pending || 0}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Pending Orders
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <LinearProgress 
                variant="determinate" 
                value={(stats.pending / (stats.total || 1)) * 100}
                sx={{ 
                  width: '100%', 
                  mr: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
              <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                {stats.pending} of {stats.total}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Revisions */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          height: '100%',
          background: `linear-gradient(45deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 2
        }}>
          <CardContent sx={{ position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ReceiptIcon />
            </Box>
            <Typography variant="h5" sx={{ mt: 1 }}>
              {stats.revisionsUsed || 0} / {(stats.total || 0) * 2 + (stats.revisionsPurchased || 0)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Revisions Used / Total
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <LinearProgress 
                variant="determinate" 
                value={stats.total ? (stats.revisionsUsed / ((stats.total * 2) + (stats.revisionsPurchased || 0)) * 100) : 0}
                sx={{ 
                  width: '100%', 
                  mr: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
              <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                {stats.revisionsPurchased > 0 && `+${stats.revisionsPurchased} purchased`}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardStats; 