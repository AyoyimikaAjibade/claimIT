import React, { useState, useEffect, useContext } from 'react';
import { Card, Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaFire, FaWater, FaBuilding, FaBusinessTime, FaQuestionCircle, FaWind } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
import { AuthContext } from '../context/AuthContext';

const DisasterUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const { authToken } = useContext(AuthContext);

  const fetchUpdates = async () => {
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
  };

  useEffect(() => {
    if (authToken) {
      fetchUpdates();
    }
  }, [authToken]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'danger';
      default:
        return 'secondary';
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
        return <FaBusinessTime className="me-2" />;
      case 'tornado':
        return <FaWind className="me-2" />;
      default:
        return <FaQuestionCircle className="me-2" />;
    }
  };

  const filteredUpdates = updates.filter(update => {
    const matchesSeverity = !selectedSeverity || update.severity === parseInt(selectedSeverity);
    const matchesType = !selectedType || update.disaster_type === selectedType;
    return matchesSeverity && matchesType;
  });

  return (
    <Container className="py-4">
      <h2 className="mb-4">Disaster Updates</h2>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Latest Updates</h3>
            <Button
              variant="outline-primary"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {showFilters && (
            <div className="mb-4">
              <Row>
                <Col md={6}>
                  <select
                    className="form-select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">All Disaster Types</option>
                    <option value="wildfire">Wildfire</option>
                    <option value="flood">Flood</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="hurricane">Hurricane</option>
                    <option value="tornado">Tornado</option>
                    <option value="other">Other</option>
                  </select>
                </Col>
                <Col md={6}>
                  <select
                    className="form-select"
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                  >
                    <option value="">All Severities</option>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                  </select>
                </Col>
              </Row>
            </div>
          )}

          {loading ? (
            <div className="text-center">Loading updates...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Severity</th>
                    <th>Source</th>
                    <th>Title</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUpdates.map((update) => (
                    <tr key={update.id}>
                      <td>{moment(update.created_at).format('MMM D, YYYY')}</td>
                      <td>
                        {getDisasterIcon(update.disaster_type)}
                        {update.disaster_type.replace(/_/g, ' ').toUpperCase()}
                      </td>
                      <td>{update.location}</td>
                      <td>
                        <Badge bg={getSeverityColor(update.severity)}>
                          {update.severity === 1 ? 'Low' : update.severity === 2 ? 'Medium' : 'High'}
                        </Badge>
                      </td>
                      <td>{update.source}</td>
                      <td>
                        <Button
                          variant="link"
                          onClick={() => {
                            window.open(update.url, '_blank');
                          }}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DisasterUpdates;