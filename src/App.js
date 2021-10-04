import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify';
import { AuthContext, UserContext } from './libs/contextLib';
import { useApolloClient } from '@apollo/client';
import { onError } from './libs/errorLib';
import Routes from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(null);
  const client = useApolloClient();

  async function onLoad() {
    try {
      const currentSession = await Auth.currentSession();
      setCurrentUserName(currentSession.idToken.payload.email);
      setIsAuthenticated(true);
    } catch (error) {
      if (error !== 'No current user') {
        onError(error);
      }
    }
    setIsAuthenticating(false);
  };
  
  useEffect(() => {
    onLoad();
  }, []);

  async function handleLogout () {
    await Auth.signOut();
    setIsAuthenticated(false);
    setCurrentUserName(null);
    await client.clearStore();
    history.push('/login');
  };

  return (
    !isAuthenticating &&
    <div className='App container-fluid'>
      <Navbar collapseOnSelect expand="lg" bg='light' className='mb-3'>
        <LinkContainer to='/'>
          <Navbar.Brand>
            Inventory
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-space-between'>
          <Nav className="mr-auto" activeKey={window.location.pathname}>
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
                <Nav.Link>
                  Machine types
                  {/* Item types */}
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
            {isAuthenticated &&
              <LinkContainer to='/groups'>
                <Nav.Link>
                  Groups
                </Nav.Link>
              </LinkContainer>
            }
            {isAuthenticated &&
              <LinkContainer to='/locations'>
                <Nav.Link>
                  Locations
                </Nav.Link>
              </LinkContainer>
            }
            {isAuthenticated &&
              <LinkContainer to='/actionTypes'>
                <Nav.Link>
                  Work types
                  {/* Action types */}
                </Nav.Link>
              </LinkContainer>
            }
          </Nav>
          <Nav activeKey={window.location.pathname}>
            {isAuthenticated ? (
              <>
                <LinkContainer to='/endUserAccount'>
                  <Nav.Link>
                    {currentUserName}
                  </Nav.Link>
                </LinkContainer>
                {/* <Nav.Link>{currentUserName}</Nav.Link> */}
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
      </Navbar>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <UserContext.Provider value={{ currentUserName, setCurrentUserName }}>
          <Routes />
        </UserContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
