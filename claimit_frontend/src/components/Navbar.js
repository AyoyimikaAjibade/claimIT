import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

const NavbarComponent = () => {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authToken) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/user-profiles/`,
            {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            }
          );
          // The API returns a list, and we want the first (and only) profile
          if (response.data && response.data.length > 0) {
            setUsername(response.data[0].user.username);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };

    fetchUserProfile();
  }, [authToken]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Function to capitalize the first letter of each word
  const capitalizeUsername = (name) => {
    if (!name) return '';
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Navbar expand="lg" className="auth-header">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          <FaUser className="me-2" />
          claimIT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-collapse" />
        <Navbar.Collapse id="navbar-collapse">
          {authToken && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/claims">Claims</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              <Nav.Link as={Link} to="/disaster-updates">Disaster Updates</Nav.Link>
            </Nav>
          )}
          <Nav>
            {authToken ? (
              <>
                <div className="welcome-message me-3">
                  <span className="text-white">Welcome, <strong style={{ fontWeight: 800, fontSize: '1.1rem' }}>{capitalizeUsername(username)}</strong></span>
                </div>
                <Button variant="outline-light" onClick={handleLogout} className="ms-2">
                  <FaSignOutAlt className="me-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-3">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;