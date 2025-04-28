import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Navbar.css';

const NavbarComponent = ({ isAuthenticated }) => {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          if (response.data && response.data.length > 0) {
            setUsername(response.data[0].user.username);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [authToken]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const capitalizeUsername = (name) => {
    if (!name) return '';
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Navbar 
      expand="lg" 
      className={`fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}
    >
      <Container fluid={isAuthenticated} className={isAuthenticated ? 'px-md-4' : ''}>
        <Navbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center">
          <span className="brand-text">claimIT</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-collapse" />
        <Navbar.Collapse id="navbar-collapse">
          <Nav className="ms-auto">
            {authToken ? (
              <div className="d-flex align-items-center">
                <div className="user-profile me-3">
                  <FaUser className="user-icon" />
                  <span className="username">
                    {capitalizeUsername(username)}
                  </span>
                </div>
                <Button 
                  variant="outline-primary" 
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  <FaSignOutAlt className="me-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary"
                  className="me-2"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary"
                >
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;