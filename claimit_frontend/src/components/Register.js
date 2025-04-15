import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register/`, {
        username,
        email,
        password,
      });
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container d-flex flex-column min-vh-100">

      <main className="auth-content flex-grow-1">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col md={8} className="text-center">
              <h1 className="display-4 fw-bold text-primary">Join claimIT Today</h1>
              <p className="lead fs-4">Create your account to manage your insurance claims</p>
            </Col>
          </Row>
          
          <Row className="justify-content-center">
            <Col md={6}>
              <div className="auth-card">
                <h2 className="auth-title">Create Your Account</h2>

                {error && (
                  <div className="alert alert-danger auth-alert" role="alert">
                    {error}
                  </div>
                )}

                <Form onSubmit={handleRegister} className="auth-form">
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
                      placeholder="Choose a username"
                    />
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label className="d-flex align-items-center">
                      <FaEnvelope className="me-2" />
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
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
                      placeholder="Create a password"
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="auth-btn auth-btn-primary">
                    Create Account
                  </Button>
                  <Link to="/login" className="btn auth-btn auth-btn-outline">
                    Already have an account? Login
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

export default Register;