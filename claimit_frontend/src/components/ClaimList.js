import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaBan } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import '../styles/claims.css';

const ClaimList = () => {
  const { authToken } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClaims = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/claims/`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setClaims(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching claims", err);
      setError("Failed to load claims. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) fetchClaims();
  }, [authToken, fetchClaims]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <FaCheckCircle className="text-success" />;
      case 'pending':
        return <FaClock className="text-warning" />;
      case 'rejected':
        return <FaBan className="text-danger" />;
      case 'under_review':
        return <FaClock className="text-info" />;
      case 'settled':
        return <FaCheckCircle className="text-secondary" />;
      default:
        return <FaExclamationTriangle className="text-secondary" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container fluid className="claims-container">
        <h2 className="claims-title">Your Claims</h2>
        <Row>
          {[1, 2, 3].map((index) => (
            <Col md={12} key={index}>
              <Card className="claim-card loading-skeleton" style={{ height: '200px' }} />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="claims-container">
      <h2 className="claims-title">Your Claims</h2>
      
      {error ? (
        <Card className="claim-card">
          <Card.Body className="text-center text-danger">
            <FaExclamationTriangle size={48} className="mb-3" />
            <h5>{error}</h5>
          </Card.Body>
        </Card>
      ) : claims.length === 0 ? (
        <Card className="claim-card">
          <Card.Body className="text-center text-muted">
            <h5>No claims found</h5>
            <p>Submit your first claim to get started</p>
          </Card.Body>
        </Card>
      ) : (
        claims.map(claim => (
          <Card key={claim.id} className="claim-card">
            <div className="claim-header">
              <h5 className="claim-title">
                Claim #{claim.id} - {claim.disaster_type}
              </h5>
              <span className={`status-badge ${claim.status.toLowerCase()}`}>
                {getStatusIcon(claim.status)} {claim.status.replace('_', ' ')}
              </span>
            </div>
            <div className="claim-body">
              <div className="claim-info-grid">
                <div className="claim-info-item">
                  <span className="claim-info-label">Property Type</span>
                  <span className="claim-info-value">
                    {claim.property_type.charAt(0).toUpperCase() + claim.property_type.slice(1)}
                  </span>
                </div>
                <div className="claim-info-item">
                  <span className="claim-info-label">Estimated Loss</span>
                  <span className="claim-info-value">
                    {formatCurrency(claim.estimated_loss)}
                  </span>
                </div>
                <div className="claim-info-item">
                  <span className="claim-info-label">Predicted Approval</span>
                  <span className="claim-info-value">
                    {claim.predicted_approval || 'N/A'}
                  </span>
                </div>
                <div className="claim-info-item">
                  <span className="claim-info-label">Predicted Limit</span>
                  <span className="claim-info-value">
                    {claim.predicted_limit ? formatCurrency(claim.predicted_limit) : 'N/A'}
                  </span>
                </div>
                <div className="claim-info-item">
                  <span className="claim-info-label">Submitted</span>
                  <span className="claim-info-value">
                    {formatDate(claim.created_at)}
                  </span>
                </div>
              </div>
              <div className="claim-description mt-3">
                <span className="claim-info-label">Description</span>
                <p className="claim-info-value mb-0">
                  {claim.description}
                </p>
              </div>
            </div>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ClaimList;
