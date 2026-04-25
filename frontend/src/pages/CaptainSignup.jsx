import React from 'react';
import { Navigate } from 'react-router-dom';

const CaptainSignup = () => <Navigate to="/signup?role=captain" replace />;

export default CaptainSignup;
