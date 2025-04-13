import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const NavbarComponent = () => {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard">
          <FaUser className="me-2" />
          claimIT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-collapse" />
        <Navbar.Collapse id="navbar-collapse">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/claims">Claims</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/disaster-updates">Disaster Updates</Nav.Link>
          </Nav>
          <Nav>
            {authToken ? (
              <Button variant="outline-light" onClick={handleLogout} className="ms-2">
                <FaSignOutAlt className="me-2" />
                Logout
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white me-3">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-white">
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