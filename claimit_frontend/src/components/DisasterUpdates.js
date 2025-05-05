import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Card, Container, Button, Badge, Table, Alert, Spinner } from 'react-bootstrap';
import { FaFire, FaWater, FaBuilding, FaExclamationTriangle, FaQuestionCircle, FaWind, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
import { AuthContext } from '../context/AuthContext';

const DisasterUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const { authToken } = useContext(AuthContext);

  const fetchUpdates = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/disaster-updates/`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setUpdates(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch disaster updates');
      setLoading(false);
    }
  }, [authToken]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/profile/`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setUserProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch user profile', err);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      fetchUpdates();
      fetchUserProfile();
    }
  }, [authToken, fetchUpdates, fetchUserProfile]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'danger';
      case 4:
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      case 4:
        return 'Unknown';
      default:
        return 'Unknown';
    }
  };

  const getDisasterIcon = (type) => {
    switch (type) {
      case 'wildfire':
        return <FaFire className="me-2" />;
      case 'flood':
        return <FaWater className="me-2" />;
      case 'earthquake':
        return <FaBuilding className="me-2" />;
      case 'hurricane':
        return <FaExclamationTriangle className="me-2" />;
      case 'tornado':
        return <FaWind className="me-2" />;
      default:
        return <FaQuestionCircle className="me-2" />;
    }
  };

  const getAssistanceIcon = (available) => {
    return available ? 
      <FaCheckCircle className="text-success" title="Assistance Available" /> : 
      <FaInfoCircle className="text-secondary" title="No Assistance Available" />;
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Disaster Updates</h2>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Latest Updates {userProfile && userProfile.state ? `from ${userProfile.state}` : ''}</h3>
          </div>

          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading updates...</span>
              </Spinner>
              <p className="mt-3">Loading disaster updates...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : updates.length === 0 ? (
            <Alert variant="info">No disaster updates available for your area.</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover responsive className="align-middle">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Severity</th>
                    <th>Declaration</th>
                    <th>Location</th>
                    <th>Assistance</th>
                    <th>Source</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {updates.map((update) => (
                    <tr key={update.id}>
                      <td>{moment(update.updated_at_formatted || update.updated_at).format('MMM D, YYYY')}</td>
                      <td>
                        {getDisasterIcon(update.disaster_type)}
                        <span className="text-capitalize">{update.disaster_type.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="fw-bold">{update.title}</td>
                      <td>
                        <Badge bg={getSeverityColor(update.severity)}>
                          {getSeverityLabel(update.severity)}
                        </Badge>
                      </td>
                      <td>
                        <small className="text-muted" style={{fontSize: '0.8rem'}}>{update.declaration_display}</small>
                      </td>
                      <td>{update.location}</td>
                      <td className="text-center">{getAssistanceIcon(update.assistance_available)}</td>
                      <td>{update.source}</td>
                      <td>
                        {update.url ? (
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => window.open(update.url, '_blank')}
                          >
                            Details
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline-secondary" disabled>No Link</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DisasterUpdates;