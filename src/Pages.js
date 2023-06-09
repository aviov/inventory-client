import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import Projects from './components/Projects';
import ProjectForm from './components/ProjectForm';
import ProjectInfo from './components/ProjectInfo';
import ActionGangForm from './components/ActionGangForm';
import ActionGangInfo from './components/ActionGangInfo';
import ActionTemplForm from './components/ActionTemplForm';
import ActionTemplInfo from './components/ActionTemplInfo';
import EndUserAccount from './components/EndUserAccount';
import VerifyEndUserEmail from './components/VerifyEndUserEmail';
import InviteEndUserConfirm from './components/InviteEndUserConfirm';
import NotFound from './components/NotFound';
import './Pages.css';

export default function Pages() {

  return (
    <div
      className='Pages'
    >
      <Routes>
        <Route exact path='/' element={<Items />} />

        <Route exact path='/calendar' element={<Calendar />} />

        <Route exact path='/plan' element={ <Plan />} />

        <Route
          exact
          path='/actionGangs/new'
          element={
            <AuthenticatedRoute>
              <ActionGangForm />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact
          path='/actionGangs/:id'
          element={
            <AuthenticatedRoute>
              <ActionGangInfo />
            </AuthenticatedRoute>
          }
        />

        <Route
          exact
          path='/actionTempls/new'
          element={
            <AuthenticatedRoute>
              <ActionTemplForm />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact
          path='/actionTempls/:id'
          element={
            <AuthenticatedRoute>
              <ActionTemplInfo />
            </AuthenticatedRoute>
          }
        />

        <Route
          exact
          path='/customers'
          element={
            <AuthenticatedRoute>
              <Orgs
                prefix={'org::customer:'}
                prefixType={'customers'}
              />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact
          path='/customers/new'
          element={
            <AuthenticatedRoute>
              <OrgForm
                prefix={'org::customer:'}
              />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact
          path='/customers/:id'
          element={
            <AuthenticatedRoute>
              <OrgInfo
                prefix={'org::customer:'}
                prefixType={'customers'}
              />
            </AuthenticatedRoute>
          }
        />

        <Route
          exact
          path='/customers/:id/endUsers/new'
          element={
            <AuthenticatedRoute>
              <EndUserForm
                prefix={'org:enduser::'}
                prefixType={'customers'}
              />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact
          path='/customers/:parentId/endUsers/:id'
          element={
            <AuthenticatedRoute>
              <EndUserInfo
                prefix={'org:enduser::'}
                prefixType={'customers'}
              />
            </AuthenticatedRoute>
          }
        />

        <Route
          exact
          path='/suppliers'
          element={
            <AuthenticatedRoute>
              <Orgs
                prefix={'org::supplier:'}
                prefixType={'suppliers'}
              />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact
          path='/suppliers/new'
          element={
            <AuthenticatedRoute>
              <OrgForm
                prefix={'org::supplier:'}
              />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact
          path='/suppliers/:id'
          element={
            <AuthenticatedRoute>
              <OrgInfo
                prefix={'org::supplier:'}
                prefixType={'suppliers'}
              />
            </AuthenticatedRoute>
          }
        />

        <Route
          exact
          path='/suppliers/:id/endUsers/new'
          element={
            <AuthenticatedRoute>
              <EndUserForm
                prefix={'org:enduser::'}
                prefixType={'suppliers'}
              />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact
          path='/suppliers/:parentId/endUsers/:id'
          element={
            <AuthenticatedRoute>
              <EndUserInfo
                prefix={'org:enduser::'}
                prefixType={'suppliers'}
              />
            </AuthenticatedRoute>
          }
        />
        
        <Route
          exact path='/items'
          element={
            <AuthenticatedRoute>
              <Items />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/items/new'
          element={
            <AuthenticatedRoute>
              <ItemForm />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/items/:id'
          element={
            <AuthenticatedRoute>
              <ItemInfo />
            </AuthenticatedRoute>
          }
        />
        
        <Route
          exact path='/itemTypes'
          element={
            <AuthenticatedRoute>
              <ItemTypes />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/itemTypes/new'
          element={
            <AuthenticatedRoute>
              <ItemTypeForm />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/itemTypes/:id'
          element={
            <AuthenticatedRoute>
              <ItemTypeInfo />
            </AuthenticatedRoute>
          }
        />
        
        <Route
          exact path='/endUsers'
          element={
            <AuthenticatedRoute>
              <EndUsers />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/endUsers/new'
          element={
            <AuthenticatedRoute>
              <EndUserForm
                prefix={'enduser:'}
              />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/endUsers/:id'
          element={
            <AuthenticatedRoute>
              <EndUserInfo />
            </AuthenticatedRoute>
          }
        />
        
        <Route
          exact path='/groups'
          element={
            <AuthenticatedRoute>
              <Groups />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/groups/new'
          element={
            <AuthenticatedRoute>
              <GroupForm />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/groups/:id'
          element={
            <AuthenticatedRoute>
              <GroupInfo />
            </AuthenticatedRoute>
          }
        />
        
        <Route
          exact path='/locations'
          element={
            <AuthenticatedRoute>
              <Locations />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/locations/new'
          element={
            <AuthenticatedRoute>
              <LocationForm />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/locations/:id'
          element={
            <AuthenticatedRoute>
              <LocationInfo />
            </AuthenticatedRoute>
          }
        />

        <Route
          exact
          path='/actionTypes'
          element={
            <AuthenticatedRoute>
              <ActionTypes />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/actionTypes/new'
          element={
            <AuthenticatedRoute>
              <ActionTypeForm />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact path='/actionTypes/:id'
          element={
            <AuthenticatedRoute>
              <ActionTypeInfo />
            </AuthenticatedRoute>
          }
        />

        <Route
          exact
          path='/projects'
          element={
            <AuthenticatedRoute>
              <Projects
                prefix={'org::project:'}
                prefixType={'projects'}
              />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact
          path='/projects/new'
          element={
            <AuthenticatedRoute>
              <ProjectForm
                prefix={'org::project:'}
              />
            </AuthenticatedRoute>
          }
        />
        <Route
          exact
          path='/projects/:id'
          element={
            <AuthenticatedRoute>
              <ProjectInfo
                prefix={'org::project:'}
                prefixType={'projects'}
              />
            </AuthenticatedRoute>
          }
        />
        
        <Route
          exact
          path='/tenants'
          element={
            <AuthenticatedRoute>
              <Tenants />
            </AuthenticatedRoute>
          }
        />

        <Route
          exact
          path='/tenantUsers'
          element={
            <AuthenticatedRoute>
              <TenantUsers />
            </AuthenticatedRoute>
          }
        />

        <Route
          exact path='/endUserAccount'
          element={
            <AuthenticatedRoute>
              <EndUserAccount />
            </AuthenticatedRoute>
          }
        />

        <Route
          exact path="/login"
          element={
            <UnauthenticatedRoute>
              <Login />
            </UnauthenticatedRoute>
          }
        />
        <Route
          exact path="/signup"
          element={
            <UnauthenticatedRoute>
              <Signup />
            </UnauthenticatedRoute>
          }
        />

        <Route exact path="/verifyEmail" element={<VerifyEndUserEmail />} />
        <Route exact path="/inviteEmail" element={<InviteEndUserConfirm />} />
        <Route element={<NotFound />}/>
      </Routes>
    </div>
  )
}