import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AddAccountPage } from './pages/AddAccountPage';
import { NewAccountPage } from './pages/NewAccountPage';
import { NewCardPage } from './pages/NewCardPage';

const AppRoutes = () => {
  return (
    <>
      <Route path="/add-account" element={<ProtectedRoute><AddAccountPage /></ProtectedRoute>} />
      <Route path="/add-account/new-account" element={<ProtectedRoute><NewAccountPage /></ProtectedRoute>} />
      <Route path="/add-account/new-card" element={<ProtectedRoute><NewCardPage /></ProtectedRoute>} />
    </>
  );
};

export default AppRoutes; 