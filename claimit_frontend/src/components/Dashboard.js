import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaMoneyBillWave, FaFileAlt, FaUserShield, FaPlus, FaList } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    totalAmount: 0
  });
  const [recentClaims, setRecentClaims] = useState([]);

  // Fetch real data from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get JWT token from AuthContext
        const token = authToken;
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }

        // Fetch claims from backend
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/claims/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        // Process the data to calculate the stats
        const claims = response.data;
        
        // Calculate total claims
        const totalClaims = claims.length;
        
        // Count claims by status
        const pendingClaims = claims.filter(
          claim => claim.status === 'pending' || claim.status === 'under_review'
        ).length;
        
        const approvedClaims = claims.filter(
          claim => claim.status === 'approved' || claim.status === 'settled'
        ).length;
        
        // Sum up the estimated losses for all claims
        const totalAmount = claims.reduce(
          (sum, claim) => sum + parseFloat(claim.estimated_loss), 
          0
        );
        
        // Get recent claims (sorted by created_at, which should come from the API already sorted)
        const recentClaimsData = claims.slice(0, 5);

        // Update state with real data
        setStats({
          totalClaims,
          pendingClaims,
          approvedClaims,
          totalAmount
        });
        
        setRecentClaims(recentClaimsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to sample data if API call fails
        setStats({
          totalClaims: 0,
          pendingClaims: 0,
          approvedClaims: 0,
          totalAmount: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authToken]);

  const handleNewClaim = () => {
    navigate('/claim/new');
  };

  if (loading) {
    return (
      <Container fluid className="dashboard-container">
        <Row className="mb-4">
          {[1, 2, 3, 4].map((item) => (
            <Col md={3} key={item}>
              <Card className="stat-card loading-skeleton" style={{ height: '150px' }} />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card primary-gradient">
            <Card.Body className="stat-card-body">
              <h6 className="stat-card-title">Total Claims</h6>
              <h2 className="stat-card-value">{stats.totalClaims}</h2>
              <FaChartLine className="stat-card-icon" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card success-gradient">
            <Card.Body className="stat-card-body">
              <h6 className="stat-card-title">Pending Claims</h6>
              <h2 className="stat-card-value">{stats.pendingClaims}</h2>
              <FaMoneyBillWave className="stat-card-icon" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card info-gradient">
            <Card.Body className="stat-card-body">
              <h6 className="stat-card-title">Approved Claims</h6>
              <h2 className="stat-card-value">{stats.approvedClaims}</h2>
              <FaFileAlt className="stat-card-icon" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card warning-gradient">
            <Card.Body className="stat-card-body">
              <h6 className="stat-card-title">Total Amount</h6>
              <h2 className="stat-card-value">${stats.totalAmount.toLocaleString()}</h2>
              <FaUserShield className="stat-card-icon" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="quick-actions mb-4">
        <Card.Body>
          <h3 className="mb-4">Quick Actions</h3>
          <Row>
            <Col md={6}>
              <Button 
                variant="primary"
                size="lg"
                className="action-button w-100"
                onClick={handleNewClaim}
              >
                <FaPlus /> File New Claim
              </Button>
            </Col>
            <Col md={6}>
              <Button 
                variant="outline-primary"
                size="lg"
                className="action-button w-100"
                onClick={() => navigate('/claims')}
              >
                <FaList /> View All Claims
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Recent Updates */}
      <Card className="updates-card">
        <Card.Body>
          <h3 className="mb-4">Recent Claims</h3>
          <div className="table-container">
            <table className="table updates-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Disaster Type</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.length > 0 ? (
                  recentClaims.map((claim) => (
                    <tr key={claim.id}>
                      <td>{new Date(claim.created_at).toLocaleDateString()}</td>
                      <td>{claim.disaster_type.charAt(0).toUpperCase() + claim.disaster_type.slice(1)}</td>
                      <td>
                        <span className={`status-badge ${claim.status}`}>
                          {claim.status.replace('_', ' ').charAt(0).toUpperCase() + claim.status.replace('_', ' ').slice(1)}
                        </span>
                      </td>
                      <td>${parseFloat(claim.estimated_loss).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No claims found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
