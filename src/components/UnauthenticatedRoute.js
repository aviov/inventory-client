import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../libs/contextLib';

function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default function UnauthenticatedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  const redirect = querystring('redirect');
  return(!isAuthenticated ? (
    children
  ) : (
    <Navigate
      to={redirect === '' || redirect === null ? '/' : redirect}
    />
  ));
}