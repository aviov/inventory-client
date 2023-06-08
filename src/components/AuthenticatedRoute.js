import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../libs/contextLib';

export default function AuthenticatedRoute({ children, redirectTo }) {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAuthContext();

  // const AuthenticatedElement = isAuthenticated ? (
  //   <React.Fragment>
  //     {element}
  //   </React.Fragment>
  // ) : (
  //   <Navigate
  //     to={`/login?redirect=${pathname}${search}`}
  //   />
  // );

  // return(
  //   <Route {...rest} element={<AuthenticatedElement />} />
  // );
  return(isAuthenticated ? (
    children
  ) : (
    <Navigate
      to={'/'}
      // to={`/login?redirect=${pathname}${search}`}
    />
  ));
}