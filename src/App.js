import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify';
import { AuthContext, UserContext, TenantContext, TenantUserContext } from './libs/contextLib';
import { useApolloClient } from '@apollo/client';
import { sliceStringAfter } from './libs/fnsLib';
import { onError } from './libs/errorLib';
import Pages from './Pages';
import {
  QUERY_getTenantUser,
  QUERY_getTenantById
} from './api/queries';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [currentTenantId, setCurrentTenantId] = useState(null);
  const [currentTenantUser, setCurrentTenantUser] = useState({
    name: null,
    nameTwo: null,
    emailVerified: null
  });
  const [getTenantUser, { data: dataTenantUser, loading: loadingTenantUser }] = useLazyQuery(QUERY_getTenantUser);
  const [getTenantById, { data, loading }] = useLazyQuery(QUERY_getTenantById);
  const client = useApolloClient();
  
  useEffect(() => {
    async function onLoad() {
      let email = '';
      try {
        const currentSession = await Auth.currentSession();
        email = currentSession.idToken.payload.email
        setIsAuthenticated(true);
        setCurrentTenantId(
          (currentSession.getAccessToken().payload['cognito:groups'] || [])[0]
        );
      } catch (error) {
        if (error !== 'No current user') {
          onError(error);
        }
      }
      try {
        getTenantUser({
          variables: {
            refId: 'user:' + email,
            tenantUserId: 'tenantuser:' + email + ':tenant:' + sliceStringAfter(currentTenantId, ':') 
          }
        });
        if (dataTenantUser && dataTenantUser.getTenantUser !== null) {
          const {
            name,
            nameTwo,
            emailVerified
          } = dataTenantUser.getTenantUser;
          setCurrentTenantUser({
            name,
            nameTwo,
            emailVerified
          });
          setCurrentUserName('user:' + email);
        }
      } catch (error) {
        onError(error);
      }
      try {
        getTenantById({
          variables: { tenantId: currentTenantId }
        });
        if (data && data.getTenantById !== null) {
          const {
            name
          } = data.getTenantById;
          setCurrentTenantUser({
            name
          });
          setCurrentUserName('owner:' + email);
        }
      } catch (error) {
        onError(error);
      }
      setIsAuthenticating(false);
    };
    onLoad();
  }, [
    getTenantUser,
    dataTenantUser,
    getTenantById,
    currentTenantId,
    data
  ]);

  async function handleLogout () {
    await Auth.signOut();
    setIsAuthenticated(false);
    setCurrentUserName(null);
    setCurrentTenantId(null);
    await client.clearStore();
    navigate('/login');
  };

  return (
    !isAuthenticating &&
    <div className='App container-fluid'>
      <Navbar
        // sticky='top'
        collapseOnSelect
        expand="lg"
        bg='dark'
        variant='dark'
        className='mb-3'
      >
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              Keepserv
            </Navbar.Brand>
          </LinkContainer>
        </Container>
        <Container>
          <Navbar.Toggle />
        </Container>
        <Container>
          <Navbar.Collapse className='justify-content-space-between'>
            <Nav className="mr-auto" activeKey={window.location.pathname}>
              {currentTenantId &&
                <>
                  {isAuthenticated &&
                    <LinkContainer to='/calendar'>
                      <Nav.Link>
                        Calendar
                      </Nav.Link>
                    </LinkContainer>
                  }
                  {isAuthenticated &&
                    <LinkContainer to='/plan'>
                      <Nav.Link>
                        Plan
                      </Nav.Link>
                    </LinkContainer>
                  }
                  {isAuthenticated &&
                    <LinkContainer to='/items'>
                      <Nav.Link>
                        Machines
                        {/* Items */}
                      </Nav.Link>
                    </LinkContainer>
                  }
                  {isAuthenticated &&
                    <LinkContainer to='/itemTypes'>
                      <Nav.Link className='text-nowrap'>
                        Machine types
                        {/* Item types */}
                      </Nav.Link>
                    </LinkContainer>
                  }
                  {isAuthenticated &&
                    <LinkContainer to='/customers'>
                      <Nav.Link>
                        Customers
                      </Nav.Link>
                    </LinkContainer>
                  }
                  {isAuthenticated &&
                    <LinkContainer to='/suppliers'>
                      <Nav.Link>
                        Suppliers
                      </Nav.Link>
                    </LinkContainer>
                  }
                  {isAuthenticated &&
                    <LinkContainer to='/endUsers'>
                      <Nav.Link>
                        Persons
                        {/* End users */}
                      </Nav.Link>
                    </LinkContainer>
                  }
                  {/* {isAuthenticated &&
                    <LinkContainer to='/groups'>
                      <Nav.Link>
                        Groups
                      </Nav.Link>
                    </LinkContainer>
                  } */}
                  {isAuthenticated &&
                    <LinkContainer to='/locations'>
                      <Nav.Link>
                        Locations
                      </Nav.Link>
                    </LinkContainer>
                  }
                  {isAuthenticated &&
                    <LinkContainer to='/actionTypes'>
                      <Nav.Link className='text-nowrap'>
                        Work types
                        {/* Action types */}
                      </Nav.Link>
                    </LinkContainer>
                  }
                  {isAuthenticated &&
                    <LinkContainer to='/projects'>
                      <Nav.Link>
                        Projects
                      </Nav.Link>
                    </LinkContainer>
                  }
                </>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
        <Container>
          <Navbar.Collapse>
            <Nav className="mr-auto" activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  {(loading || !data) ? 
                    (
                      <>
                      </>
                    ) : (
                      <LinkContainer to='/tenantUsers'>
                        <Nav.Link>
                          {'Users'}
                        </Nav.Link>
                      </LinkContainer>
                    )
                  }
                  {(loading || loadingTenantUser || !data) ? 
                    (
                      <>
                      </>
                    ) : (
                      <LinkContainer to='/tenants'>
                        <Nav.Link>
                          {currentTenantUser && currentTenantUser.name}
                        </Nav.Link>
                      </LinkContainer>
                    )
                  }
                  <LinkContainer to='/endUserAccount'>
                    <Nav.Link>
                      {currentUserName && sliceStringAfter(currentUserName, ':')}
                    </Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <UserContext.Provider value={{ currentUserName, setCurrentUserName }}>
          <TenantContext.Provider value={{ currentTenantId, setCurrentTenantId }}>
            <TenantUserContext.Provider value={{ currentTenantUser, setCurrentTenantUser }}>
              <Pages />
            </TenantUserContext.Provider>
          </TenantContext.Provider>
        </UserContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
