import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Start from './pages/Start';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import Home from './pages/Home';
import UserLogout from './pages/UserLogout';
import CaptainHome from './pages/CaptainHome';
import CaptainLogout from './pages/CaptainLogout';
import Riding from './pages/Riding';
import CaptainRiding from './pages/CaptainRiding';
import 'remixicon/fonts/remixicon.css';
import SwitchUser from './pages/SwitchUser';
import WelcomeScreen from './pages/WelcomeScreen';
import Service from './pages/Service';
import Activity from './pages/Activity';
import Account from './pages/Account';
import ProtectedRoute from './components/ProtectedRoute';
import CaptainServices from './pages/CaptainServices';
import CaptainStatus from './pages/CaptainStatus';
import CaptainSettings from './pages/CaptainSettings';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Start />} />
      <Route path='/switch-user' element={<SwitchUser />} />
      <Route path='/SwitchUser' element={<Navigate to='/switch-user' replace />} />

      <Route path='/login' element={<UserLogin />} />
      <Route path='/signup' element={<UserSignup />} />
      <Route path='/captain-login' element={<Navigate to='/login?role=captain' replace />} />
      <Route path='/captain-signup' element={<Navigate to='/signup?role=captain' replace />} />

      <Route path='/home' element={<Navigate to='/user/home' replace />} />
      <Route path='/service' element={<Navigate to='/user/services' replace />} />
      <Route path='/activity' element={<Navigate to='/user/activity' replace />} />
      <Route path='/account' element={<Navigate to='/user/account' replace />} />
      <Route path='/WelcomeScreen' element={<Navigate to='/user/welcome' replace />} />
      <Route path='/driver' element={<Navigate to='/captain/home' replace />} />
      <Route path='/captain-home' element={<Navigate to='/captain/home' replace />} />
      <Route path='/riding' element={<Navigate to='/user/riding' replace />} />
      <Route path='/captain-riding' element={<Navigate to='/captain/riding' replace />} />

      <Route
        path='/user/home'
        element={
          <ProtectedRoute allowedRole='user'>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path='/user/welcome'
        element={
          <ProtectedRoute allowedRole='user'>
            <WelcomeScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path='/user/services'
        element={
          <ProtectedRoute allowedRole='user'>
            <Service />
          </ProtectedRoute>
        }
      />
      <Route
        path='/user/activity'
        element={
          <ProtectedRoute allowedRole='user'>
            <Activity />
          </ProtectedRoute>
        }
      />
      <Route
        path='/user/account'
        element={
          <ProtectedRoute allowedRole='user'>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route
        path='/user/profile'
        element={<Navigate to='/user/account' replace />}
      />
      <Route
        path='/user/settings'
        element={<Navigate to='/user/account' replace />}
      />
      <Route
        path='/user/riding'
        element={
          <ProtectedRoute allowedRole='user'>
            <Riding />
          </ProtectedRoute>
        }
      />
      <Route
        path='/user/logout'
        element={
          <ProtectedRoute allowedRole='user'>
            <UserLogout />
          </ProtectedRoute>
        }
      />

      <Route
        path='/captain/home'
        element={
          <ProtectedRoute allowedRole='captain'>
            <CaptainHome />
          </ProtectedRoute>
        }
      />
      <Route
        path='/captain/services'
        element={
          <ProtectedRoute allowedRole='captain'>
            <CaptainServices />
          </ProtectedRoute>
        }
      />
      <Route
        path='/captain/status'
        element={
          <ProtectedRoute allowedRole='captain'>
            <CaptainStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path='/captain/profile'
        element={<Navigate to='/captain/settings' replace />}
      />
      <Route
        path='/captain/settings'
        element={
          <ProtectedRoute allowedRole='captain'>
            <CaptainSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path='/captain/riding'
        element={
          <ProtectedRoute allowedRole='captain'>
            <CaptainRiding />
          </ProtectedRoute>
        }
      />
      <Route
        path='/captain/logout'
        element={
          <ProtectedRoute allowedRole='captain'>
            <CaptainLogout />
          </ProtectedRoute>
        }
      />

      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default App;
