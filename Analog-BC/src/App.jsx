import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import BusinessScreen from './screens/BusinessScreen';
import ExperiencesScreen from './screens/ExperiencesScreen';
import ExperienceDetailScreen from './screens/ExperienceDetailScreen';
import CommunityScreen from './screens/CommunityScreen';
import ProfileScreen from './screens/ProfileScreen';
import RedeemScreen from './screens/RedeemScreen';

export default function App() {
  const location = useLocation();
  const { isLoggedIn } = useApp();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/home" element={isLoggedIn ? <HomeScreen /> : <Navigate to="/login" replace />} />
        <Route path="/business/:id" element={isLoggedIn ? <BusinessScreen /> : <Navigate to="/login" replace />} />
        <Route path="/experiences" element={isLoggedIn ? <ExperiencesScreen /> : <Navigate to="/login" replace />} />
        <Route path="/experience/:id" element={isLoggedIn ? <ExperienceDetailScreen /> : <Navigate to="/login" replace />} />
        <Route path="/community" element={isLoggedIn ? <CommunityScreen /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={isLoggedIn ? <ProfileScreen /> : <Navigate to="/login" replace />} />
        <Route path="/redeem/:businessId/:merchId" element={isLoggedIn ? <RedeemScreen /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? '/home' : '/login'} replace />} />
      </Routes>
    </AnimatePresence>
  );
}
