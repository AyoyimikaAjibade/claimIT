import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Alert } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserFriends, FaSpinner, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { US_STATES } from '../utils/stateData';

// Export this function so it can be used in other components
export const fetchUserProfile = async (authToken) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/user-profiles/`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    // Handle both array and single object responses
    const profileData = Array.isArray(response.data) 
      ? response.data[0] 
      : response.data;
      
    // Ensure user object exists to prevent "Cannot read properties of undefined" error
    if (!profileData.user) {
      profileData.user = { username: '', email: '' };
    }
    
    return profileData;
  } catch (err) {
    console.error('Failed to fetch user profile', err);
    return null;
  }
};

const Profile = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    user: { username: '', email: '' },
    phone_number: '',
    street_address: '',
    city: '',
    state: '',
    country: 'United States',
    postal_code: '',
    emergency_contact: '',
    profile_picture: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await fetchUserProfile(authToken);
        if (profileData) {
          setProfile(profileData);
          setError('');
        }
      } catch (error) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      loadProfile();
    } else {
      navigate('/login');
    }
  }, [authToken, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile({
        ...profile,
        [parent]: {
          ...profile[parent],
          [child]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Phone validation
    if (profile.phone_number && !/^\+?1?\d{9,15}$/.test(profile.phone_number)) {
      errors.phone_number = "Please enter a valid phone number";
    }
    
    // US Postal code validation
    if (profile.country === 'United States' && profile.postal_code && 
        !/^\d{5}(-\d{4})?$/.test(profile.postal_code)) {
      errors.postal_code = "US postal codes must be in the format 12345 or 12345-6789";
    }
    
    // City validation
    if (profile.city && profile.city.length < 2) {
      errors.city = "City name must be at least 2 characters";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      setError('Please correct the errors in the form');
      return;
    }
    
    try {
      setSaving(true);
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/user-profiles/${profile.user.id}/`,
        profile,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setProfile(response.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response && err.response.data) {
        // Handle validation errors from backend
        if (typeof err.response.data === 'object') {
          setValidationErrors(err.response.data);
        } else {
          setError('Failed to update profile: ' + (err.response.data.detail || 'Unknown error'));
        }
      } else {
        setError('Failed to update profile. Please try again later.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    // Handle image upload logic here
    // This is a placeholder for future implementation
    console.log("Image upload not implemented yet");
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-primary">My Profile</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {loading ? (
        <div className="text-center py-5">
          <FaSpinner className="fa-spin" size={30} />
          <p className="mt-3">Loading your profile...</p>
        </div>
      ) : (
        <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
          <Card.Header className="bg-primary text-white py-3">
            <h4 className="mb-0">Profile Settings</h4>
            <p className="mb-0 text-white-50 small">Manage your personal information</p>
          </Card.Header>
          <Card.Body>
            <Row className="mb-4">
              <Col md={4} className="text-center">
                <Image
                  src={profile.profile_picture || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%22150%22%20viewBox%3D%220%200%20150%20150%22%3E%3Ccircle%20cx%3D%2275%22%20cy%3D%2275%22%20r%3D%2275%22%20fill%3D%22%23e0e0e0%22%2F%3E%3Cpath%20d%3D%22M75%2075c16.6%200%2030-13.4%2030-30S91.6%2015%2075%2015%2045%2028.4%2045%2045s13.4%2030%2030%2030zm0%2015c-20%200-60%2010-60%2030v15h120v-15c0-20-40-30-60-30z%22%20fill%3D%22%23a0a0a0%22%2F%3E%3C%2Fsvg%3E'}
                  roundedCircle
                  className="mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  onError={(e) => {
                    // Fallback to inline SVG if image fails to load
                    e.target.onerror = null; 
                    e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%22150%22%20viewBox%3D%220%200%20150%20150%22%3E%3Ccircle%20cx%3D%2275%22%20cy%3D%2275%22%20r%3D%2275%22%20fill%3D%22%23e0e0e0%22%2F%3E%3Cpath%20d%3D%22M75%2075c16.6%200%2030-13.4%2030-30S91.6%2015%2075%2015%2045%2028.4%2045%2045s13.4%2030%2030%2030zm0%2015c-20%200-60%2010-60%2030v15h120v-15c0-20-40-30-60-30z%22%20fill%3D%22%23a0a0a0%22%2F%3E%3C%2Fsvg%3E';
                  }}
                />
                <Button 
                  variant="outline-primary" 
                  className="w-100 mb-3"
                  onClick={() => document.getElementById('profile-image-upload').click()}
                >
                  Upload Photo
                </Button>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageChange}
                />
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
                      name="user.username"
                      value={profile.user.username}
                      onChange={handleChange}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaEnvelope className="me-2" />
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="user.email"
                      value={profile.user.email}
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
                      className={validationErrors.phone_number ? 'is-invalid' : ''}
                      type="tel"
                      name="phone_number"
                      value={profile.phone_number || ''}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                    {validationErrors.phone_number && (
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.phone_number}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Card className="mb-3 border-light">
                    <Card.Header className="bg-light">
                      <Form.Label className="d-flex align-items-center mb-0">
                        <FaMapMarkerAlt className="me-2" />
                        Address Information
                      </Form.Label>
                    </Card.Header>
                    <Card.Body className="bg-white">
                      <Row>
                        <Col xs={12} className="mb-3">
                          <Form.Control
                            type="text"
                            name="street_address"
                            value={profile.street_address || ''}
                            onChange={handleChange}
                            placeholder="Street Address"
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Control
                            className={validationErrors.city ? 'is-invalid' : ''}
                            type="text"
                            name="city"
                            value={profile.city || ''}
                            onChange={handleChange}
                            placeholder="City"
                          />
                          {validationErrors.city && (
                            <Form.Control.Feedback type="invalid">
                              {validationErrors.city}
                            </Form.Control.Feedback>
                          )}
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Select
                            required
                            name="state"
                            value={profile.state || ''}
                            onChange={handleChange}
                          >
                            <option value="">Select State</option>
                            {US_STATES.map((state) => (
                              <option key={state.code} value={state.code}>{state.name}</option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Select
                            required
                            name="country"
                            value={profile.country || 'United States'}
                            onChange={handleChange}
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="Mexico">Mexico</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Control
                            required
                            className={validationErrors.postal_code ? 'is-invalid' : ''}
                            type="text"
                            name="postal_code"
                            value={profile.postal_code || ''}
                            onChange={handleChange}
                            placeholder="ZIP/Postal Code"
                          />
                          {validationErrors.postal_code && (
                            <Form.Control.Feedback type="invalid">
                              {validationErrors.postal_code}
                            </Form.Control.Feedback>
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaUserFriends className="me-2" />
                      Emergency Contact
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="emergency_contact"
                      value={profile.emergency_contact || ''}
                      onChange={handleChange}
                      placeholder="Enter emergency contact information"
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end mt-4">
                    <Button variant="secondary" className="me-2" onClick={() => navigate('/dashboard')}>
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={saving}
                    >
                      {saving ? <><FaSpinner className="fa-spin me-2" /> Saving...</> : <><FaSave className="me-2" /> Save Changes</>}
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Profile;