import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useAuthContext } from '../libs/contextLib';

export default function AuthenticatedRoute({ children, ...rest }) {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAuthContext();
  return(
    <Route {...rest}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect
          to={`/login?redirect=${pathname}${search}`}
        />
      )}
    </Route>
  );
}