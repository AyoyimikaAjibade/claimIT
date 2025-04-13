import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaMoneyBillWave, FaFileAlt, FaUserShield } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = {
    totalClaims: 24,
    pendingClaims: 8,
    approvedClaims: 12,
    totalAmount: 150000
  };

  const handleNewClaim = () => {
    navigate('/claim/new');
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Dashboard</h2>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-primary text-white">
            <Card.Body>
              <h6 className="text-uppercase text-white-50 mb-2">Total Claims</h6>
              <h2 className="mb-0">{stats.totalClaims}</h2>
              <FaChartLine className="mb-3" style={{ fontSize: '2rem' }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-success text-white">
            <Card.Body>
              <h6 className="text-uppercase text-white-50 mb-2">Pending Claims</h6>
              <h2 className="mb-0">{stats.pendingClaims}</h2>
              <FaMoneyBillWave className="mb-3" style={{ fontSize: '2rem' }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-info text-white">
            <Card.Body>
              <h6 className="text-uppercase text-white-50 mb-2">Approved Claims</h6>
              <h2 className="mb-0">{stats.approvedClaims}</h2>
              <FaFileAlt className="mb-3" style={{ fontSize: '2rem' }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-warning text-white">
            <Card.Body>
              <h6 className="text-uppercase text-white-50 mb-2">Total Amount</h6>
              <h2 className="mb-0">${stats.totalAmount.toLocaleString()}</h2>
              <FaUserShield className="mb-3" style={{ fontSize: '2rem' }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="mb-4">
        <Card.Body>
          <h3 className="mb-4">Quick Actions</h3>
          <Row>
            <Col md={6}>
              <button 
                onClick={handleNewClaim}
                className="btn btn-primary btn-lg w-100 mb-3"
              >
                <FaFileAlt className="me-2" /> File New Claim
              </button>
            </Col>
            <Col md={6}>
              <button 
                onClick={() => navigate('/claims')}
                className="btn btn-success btn-lg w-100 mb-3"
              >
                <FaChartLine className="me-2" /> View Claims
              </button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Recent Updates */}
      <Card>
        <Card.Body>
          <h3 className="mb-4">Recent Updates</h3>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Disaster Type</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample data - replace with actual data */}
                <tr>
                  <td>Apr 12, 2025</td>
                  <td>Wildfire</td>
                  <td><span className="badge bg-warning">Pending</span></td>
                  <td>$50,000</td>
                </tr>
                <tr>
                  <td>Apr 11, 2025</td>
                  <td>Flood</td>
                  <td><span className="badge bg-success">Approved</span></td>
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
