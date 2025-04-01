import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDashboard from './components/User/UserDashboard';
import UserSupportTickets from './components/User/UserSupportTickets';
import UserJobApplications from './components/User/UserJobApplications';
import UserConsultations from './components/User/UserConsultations';
import UserProfile from './components/profile/UserProfile';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import PaymentPage from './Pages/PaymentPage';
import OrdersIframe from './components/User/OrdersManage';
const App = () => {
  return (
    <AuthProvider>
    <ThemeProvider>
      <CssBaseline />
    <Router>
        <Routes>
            <Route path="/dashboard/user" element={<UserDashboard />}>
              <Route path="support" element={<UserSupportTickets />} />
              <Route path="applications" element={<UserJobApplications />} />
              <Route path="consultations" element={<UserConsultations />} />
              <Route path="orders" element={<OrdersIframe />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
                  <Route path="/payment/:id" element={<PaymentPage />} />
        </Routes>
    </Router>
    </ThemeProvider>
    </AuthProvider>
  );
};

export default App;