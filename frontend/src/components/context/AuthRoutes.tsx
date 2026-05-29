import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// if a user is already logged in they cannot see the login page
export function PublicRoute() {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

// if a user is not logged in, they cannot see the dashboard page
export function ProtectedRoute() {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return <Outlet />;
}