import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaMoneyBillWave, FaFileAlt, FaUserShield, FaPlus, FaList } from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    totalAmount: 0
  });

  // Simulated API call - replace with actual API integration
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          totalClaims: 24,
          pendingClaims: 8,
          approvedClaims: 12,
          totalAmount: 150000
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          <h3 className="mb-4">Recent Updates</h3>
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
                <tr>
                  <td>Apr 12, 2025</td>
                  <td>Wildfire</td>
                  <td><span className="status-badge pending">Pending</span></td>
                  <td>$50,000</td>
                </tr>
                <tr>
                  <td>Apr 11, 2025</td>
                  <td>Flood</td>
                  <td><span className="status-badge approved">Approved</span></td>
                  <td>$25,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
