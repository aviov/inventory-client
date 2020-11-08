import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Items from './components/Items';
import ItemForm from './components/ItemForm';
import ItemInfo from './components/ItemInfo';
import NotFound from './components/NotFound';

export default function Routes() {
  return (
    <Switch>
      <Route exact path='/'>
        <Items />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <Route exact path='/items'>
        <Items />
      </Route>
      <AuthenticatedRoute exact path='/items/new'>
        <ItemForm />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path='/items/:id'>
        <ItemInfo />
      </AuthenticatedRoute>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}