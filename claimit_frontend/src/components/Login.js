import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

const Login = () => {
  const { saveAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/login/`,
        {
          username,
          password
        }
      );
      const token = response.data.access;
      saveAuthToken(token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="auth-container d-flex flex-column min-vh-100">

      <main className="auth-content flex-grow-1">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col md={8} className="text-center">
              <h1 className="display-4 fw-bold text-primary">Welcome to claimIT</h1>
              <p className="lead fs-4">Streamline Your Disaster Insurance Claim</p>
            </Col>
          </Row>
          
          <Row className="justify-content-center">
            <Col md={6}>
              <div className="auth-card">
                <h2 className="auth-title">Login to Your Account</h2>

                {error && (
                  <div className="alert alert-danger auth-alert" role="alert">
                    {error}
                  </div>
                )}

                <Form onSubmit={handleLogin} className="auth-form">
                  <Form.Group className="form-group">
                    <Form.Label className="d-flex align-items-center">
                      <FaUser className="me-2" />
                      Username
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Enter your username"
                    />
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label className="d-flex align-items-center">
                      <FaLock className="me-2" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="auth-btn auth-btn-primary">
                    Login
                  </Button>
                  <Link to="/register" className="btn auth-btn auth-btn-outline">
                    Register New Account
                  </Link>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      <footer className="auth-footer mt-auto">
        <Container>
          <Row>
            <Col md={4}>
              <h5>About</h5>
              <ul className="auth-footer-links">
                <li><Link to="/about">About claimIT</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Use</Link></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Customer Service</h5>
              <ul className="auth-footer-links">
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/support">Support</Link></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Keep In Touch</h5>
              <ul className="auth-footer-links">
                <li><a href="mailto:support@claimit.com">support@claimit.com</a></li>
                <li><a href="tel:+18002441180">(800) 244-1180</a></li>
              </ul>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="text-center">
              <p className="mb-0">&copy; 2024 claimIT | All Rights Reserved</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Login;