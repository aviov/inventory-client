import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Items from './components/Items';
import Tenants from './components/Tenants';
import TenantUsers from './components/TenantUsers';
import Orgs from './components/Orgs';
import OrgForm from './components/OrgForm';
import OrgInfo from './components/OrgInfo';
import Calendar from './components/Calendar';
import Plan from './components/Plan';
import ItemForm from './components/ItemForm';
import ItemInfo from './components/ItemInfo';
import ItemTypes from './components/ItemTypes';
import ItemTypeForm from './components/ItemTypeForm';
import ItemTypeInfo from './components/ItemTypeInfo';
import EndUsers from './components/EndUsers';
import EndUserForm from './components/EndUserForm';
import EndUserInfo from './components/EndUserInfo';
import Groups from './components/Groups';
import GroupForm from './components/GroupForm';
import GroupInfo from './components/GroupInfo';
import Locations from './components/Locations';
import LocationForm from './components/LocationForm';
import LocationInfo from './components/LocationInfo';
import ActionTypes from './components/ActionTypes';
import ActionTypeForm from './components/ActionTypeForm';
import ActionTypeInfo from './components/ActionTypeInfo';
import EndUserAccount from './components/EndUserAccount';
import VerifyEndUserEmail from './components/VerifyEndUserEmail';
import InviteEndUserConfirm from './components/InviteEndUserConfirm';
import NotFound from './components/NotFound';
import './Routes.css';

export default function Routes() {
  return (
    <div
      className='Routes'
    >
      <Switch>
        <Route exact path='/'>
          <Items />
        </Route>
        <Route exact path='/tenants'>
          <Tenants />
        </Route>

        <AuthenticatedRoute
          exact
          path='/tenantUsers'
          render={(props) => <TenantUsers
            {...props}
          />}
        />

        <Route
          exact
          path='/customers'
          render={(props) => <Orgs
            {...props}
            prefix={'org::customer:'}
            prefixType={'customers'}
          />}
        />
        <AuthenticatedRoute
          exact
          path='/customers/new'
          render={(props) => <OrgForm
            {...props}
            prefix={'org::customer:'}
          />}
        />
        <AuthenticatedRoute
          exact
          path='/customers/:id'
          render={(props) => <OrgInfo
            {...props}
            prefix={'org::customer:'}
            prefixType={'customers'}
          />}
        />
        <AuthenticatedRoute
          exact
          path='/customers/:id/endUsers/new'
          render={(props) => <EndUserForm
            {...props}
            prefix={'org:enduser::'}
            prefixType={'customers'}
          />}
        />
        <AuthenticatedRoute
          exact
          path='/customers/:parentId/endUsers/:id'
          render={(props) => <EndUserInfo
            {...props}
            prefix={'org:enduser::'}
            prefixType={'customers'}
          />}
        />

        <Route
          exact
          path='/suppliers'
          render={(props) => <Orgs
            {...props}
            prefix={'org::supplier:'}
            prefixType={'suppliers'}
          />}
        />
        <AuthenticatedRoute
          exact
          path='/suppliers/new'
          render={(props) => <OrgForm
            {...props}
            prefix={'org::supplier:'}
          />}
        />
        <AuthenticatedRoute
          exact
          path='/suppliers/:id'
          render={(props) => <OrgInfo
            {...props}
            prefix={'org::supplier:'}
            prefixType={'suppliers'}
          />}
        />
        <AuthenticatedRoute
          exact
          path='/suppliers/:id/endUsers/new'
          render={(props) => <EndUserForm
            {...props}
            prefix={'org:enduser::'}
            prefixType={'suppliers'}
          />}
        />
        <AuthenticatedRoute
          exact
          path='/suppliers/:parentId/endUsers/:id'
          render={(props) => <EndUserInfo
            {...props}
            prefix={'org:enduser::'}
            prefixType={'suppliers'}
          />}
        />

        <Route exact path='/calendar'>
          <Calendar />
        </Route>
        <Route exact path='/plan'>
          <Plan />
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
        <Route exact path='/itemTypes'>
          <ItemTypes />
        </Route>
        <AuthenticatedRoute exact path='/itemTypes/new'>
          <ItemTypeForm />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path='/itemTypes/:id'>
          <ItemTypeInfo />
        </AuthenticatedRoute>
        <Route exact path='/endUsers'>
          <EndUsers />
        </Route>
        <AuthenticatedRoute
          exact
          path='/endUsers/new'
          render={(props) => <EndUserForm
            {...props}
            prefix={'enduser:'}
          />}
        />
        <AuthenticatedRoute exact path='/endUsers/:id'>
          <EndUserInfo />
        </AuthenticatedRoute>
        <Route exact path='/groups'>
          <Groups />
        </Route>
        <AuthenticatedRoute exact path='/groups/new'>
          <GroupForm />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path='/groups/:id'>
          <GroupInfo />
        </AuthenticatedRoute>
        <Route exact path='/locations'>
          <Locations />
        </Route>
        <AuthenticatedRoute exact path='/locations/new'>
          <LocationForm />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path='/locations/:id'>
          <LocationInfo />
        </AuthenticatedRoute>
        <Route exact path='/actionTypes'>
          <ActionTypes />
        </Route>
        <AuthenticatedRoute exact path='/actionTypes/new'>
          <ActionTypeForm />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path='/actionTypes/:id'>
          <ActionTypeInfo />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path='/endUserAccount'>
          <EndUserAccount />
        </AuthenticatedRoute>
        <Route exact path="/verifyEmail">
          <VerifyEndUserEmail />
        </Route>
        <Route exact path="/inviteEmail">
          <InviteEndUserConfirm />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  )
}