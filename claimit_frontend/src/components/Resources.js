import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import { FaSearch, FaExternalLinkAlt, FaExclamationTriangle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/resources.css';

const Resources = () => {
  const { authToken } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Resource categories
  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'disaster-prep', label: 'Disaster Preparedness' },
    { id: 'claims-guide', label: 'Claims Guide' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact Information' }
  ];

  const fetchResources = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/resources/`,
        {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        }
      );
      setResources(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching resources", err);
      setError("Failed to load resources. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchResources();
  }, [authToken, fetchResources]);

  // Filter resources based on search term and category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container fluid className="resources-container">
        <h2 className="resources-title">Resources</h2>
        <div className="search-section">
          <div className="search-input-group loading-skeleton" style={{ height: '40px' }} />
          <div className="filter-tags loading-skeleton" style={{ height: '36px' }} />
        </div>
        <Row>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Col key={index} lg={4} md={6} className="mb-4">
              <Card className="resource-card loading-skeleton" style={{ height: '300px' }} />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="resources-container">
      <h2 className="resources-title">Resources</h2>

      <div className="search-section">
        <div className="search-input-group">
          <FaSearch className="search-icon" />
          <Form.Control
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tags">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-tag ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="error-state">
          <FaExclamationTriangle className="error-icon" />
          <p className="error-text">{error}</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">
            {searchTerm || activeCategory !== 'all'
              ? 'No resources found matching your criteria.'
              : 'No resources available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="resources-grid">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="resource-card">
              {resource.image_url && (
                <img
                  src={resource.image_url}
                  alt={resource.title}
                  className="resource-image"
                />
              )}
              <div className="resource-content">
                <div className="resource-category">{resource.category}</div>
                <h3 className="resource-title">{resource.title}</h3>
                <p className="resource-description">{resource.description}</p>
                <div className="resource-meta">
                  <span className="resource-date">
                    {formatDate(resource.created_at)}
                  </span>
                  {resource.external_url && (
                    <a
                      href={resource.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      Learn More <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Resources;