import React, { useState, useContext } from 'react';
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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
        `${process.env.REACT_APP_API_BASE_URL}/api/token/`,
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
    <div className="login-container">
      <Container fluid className="min-vh-100">
        <Row className="min-vh-100">
          <Col md={6} className="login-image">
            <div className="overlay">
              <div className="login-content">
                <h1 className="display-4">Welcome to claimIT</h1>
                <p className="lead">Streamline Your Disaster Insurance Claim</p>
              </div>
            </div>
          </Col>
          <Col md={6} className="d-flex align-items-center">
            <Card className="shadow-lg border-0 rounded-lg mx-auto" style={{ maxWidth: '500px' }}>
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-3">Login</h2>
                  <p className="text-muted">Enter your credentials to access your account</p>
                </div>
                
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                )}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
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

                  <Form.Group className="mb-3">
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

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" className="btn-lg">
                      Login
                    </Button>
                    <Link to="/register" className="btn btn-outline-secondary btn-lg">
                      Register New Account
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;