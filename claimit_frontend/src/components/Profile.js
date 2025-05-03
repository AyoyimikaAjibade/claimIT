import React, { useState, useContext, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { FaUser, FaPhone, FaMapMarkerAlt, FaLock } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { authToken } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    id: null,
    username: '',
    email: '',
    phone_number: '',
    address: '',
    emergency_contact: '',
    profile_picture: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/user-profiles/`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      const profiles = response.data;
      if (Array.isArray(profiles) && profiles.length > 0) {
        setProfile(profiles[0]);
      } else {
        setError('Profile not found');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile information:', err);
      setError('Failed to fetch profile information');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/user-profiles/${profile.id}/`,
        profile,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccess('Profile updated successfully');
      setProfile(response.data);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-primary">Profile</h2>
      
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <Card className="shadow-lg border-0">
          <Card.Header className="bg-primary text-white text-center">Profile Settings</Card.Header>
          <Card.Body>
            <Row className="mb-4">
              <Col md={4} className="text-center">
              <Image
                  src={profile.profile_picture || 'https://via.placeholder.com/150'}
                  roundedCircle
                  className="mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <Button variant="primary" className="w-100 mb-3">
                  Upload Photo
                </Button>
              </Col>
              <Col md={8}>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaUser className="me-2" />
                      Username
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleChange}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaLock className="me-2" />
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaPhone className="me-2" />
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="phone_number"
                      value={profile.phone_number}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2" />
                      Address
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      rows={3}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaUser className="me-2" />
                      Emergency Contact
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="emergency_contact"
                      value={profile.emergency_contact}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                    <Button variant="outline-secondary" onClick={() => window.location.reload()}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                {error}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            )}

            {success && (
              <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
                {success}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Profile;