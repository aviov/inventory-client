import React from 'react';
import { Switch, Route } from 'react-router-dom';
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
      <Route exact path='/login'>
        <Login />
      </Route>
      <Route exact path='/signup'>
        <Signup />
      </Route>
      <Route exact path='/items'>
        <Items />
      </Route>
      <Route exact path='/items/new'>
        <ItemForm />
      </Route>
      <Route exact path='/items/:id'>
        <ItemInfo />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}