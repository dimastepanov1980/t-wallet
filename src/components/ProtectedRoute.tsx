import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/password" />;
  }

  return <>{children}</>;
}; 