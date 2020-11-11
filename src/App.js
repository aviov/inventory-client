import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import { AppContext } from './libs/contextLib';
import { onError } from './libs/errorLib';
import Routes from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

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
      <Navbar collapseOnSelect expand="lg" bg='light' variant="light">
        <Navbar.Brand href='#home' as={Link} to='/'>
          Hardware
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href='#items' as={Link} to='/items'>
              Items
            </Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated
              ?
              (<Nav.Link href='#logout'>
                <Button
                  className='button'
                  variant='outline-primary'
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Nav.Link>)
              :
              (<>
                <Nav.Link href='#signup'>
                  <Button
                    className='button'
                    variant='outline-primary'
                    onClick={() => history.push('/signup')}
                  >
                    Signup
                  </Button>
                </Nav.Link>
                <Nav.Link href='#login'>
                  <Button
                    className='button'
                    variant='outline-primary'
                    onClick={() => history.push('/login')}
                  >
                    Login
                  </Button>
                </Nav.Link>
              </>)
            }
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
