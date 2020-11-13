import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify';
import { AppContext } from './libs/contextLib';
import { onError } from './libs/errorLib';
import Routes from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function onLoad() {
    try {
      await Auth.currentSession();
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
    history.push('/login');
  };

  return (
    !isAuthenticating &&
    <div className='App container'>
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
              <LinkContainer to='/items'>
                <Nav.Link>
                  Items
                </Nav.Link>
              </LinkContainer>
            }
          </Nav>
          <Nav activeKey={window.location.pathname}>
            {isAuthenticated ? (
              <>
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
      <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <Routes />
      </AppContext.Provider>
    </div>
  );
}

export default App;
