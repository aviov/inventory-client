import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../libs/contextLib';

export default function AuthenticatedRoute({ children, redirectTo }) {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAuthContext();

  return(isAuthenticated ? (
    children
  ) : (
    <Navigate
      // to={'/'}
      to={`/login?redirect=${pathname}${search}`}
    />
  ));
}