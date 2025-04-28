import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { FaCog, FaBell, FaLock, FaLanguage, FaPalette } from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      showProfile: true,
      shareData: false
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium'
    },
    language: 'en'
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleLanguageChange = (value) => {
    setSettings(prev => ({
      ...prev,
      language: value
    }));
  };

  return (
    <div className="container py-4">
      <Card>
        <Card.Header className="bg-white">
          <h4 className="mb-0">
            <FaCog className="me-2 text-primary" />
            Settings
          </h4>
        </Card.Header>
        <ListGroup variant="flush">
          {/* Notifications Settings */}
          <ListGroup.Item>
            <h5 className="mb-3">
              <FaBell className="me-2" />
              Notifications
            </h5>
            <Form>
              <Form.Check
                type="switch"
                id="email-notifications"
                label="Email Notifications"
                checked={settings.notifications.email}
                onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                className="mb-2"
              />
              <Form.Check
                type="switch"
                id="push-notifications"
                label="Push Notifications"
                checked={settings.notifications.push}
                onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                className="mb-2"
              />
              <Form.Check
                type="switch"
                id="sms-notifications"
                label="SMS Notifications"
                checked={settings.notifications.sms}
                onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
              />
            </Form>
          </ListGroup.Item>

          {/* Privacy Settings */}
          <ListGroup.Item>
            <h5 className="mb-3">
              <FaLock className="me-2" />
              Privacy
            </h5>
            <Form>
              <Form.Check
                type="switch"
                id="show-profile"
                label="Show my profile to other users"
                checked={settings.privacy.showProfile}
                onChange={(e) => handleSettingChange('privacy', 'showProfile', e.target.checked)}
                className="mb-2"
              />
              <Form.Check
                type="switch"
                id="share-data"
                label="Share anonymous usage data"
                checked={settings.privacy.shareData}
                onChange={(e) => handleSettingChange('privacy', 'shareData', e.target.checked)}
              />
            </Form>
          </ListGroup.Item>

          {/* Appearance Settings */}
          <ListGroup.Item>
            <h5 className="mb-3">
              <FaPalette className="me-2" />
              Appearance
            </h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Theme</Form.Label>
                  <Form.Select
                    value={settings.appearance.theme}
                    onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Font Size</Form.Label>
                  <Form.Select
                    value={settings.appearance.fontSize}
                    onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </ListGroup.Item>

          {/* Language Settings */}
          <ListGroup.Item>
            <h5 className="mb-3">
              <FaLanguage className="me-2" />
              Language
            </h5>
            <Form.Group>
              <Form.Select
                value={settings.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </Form.Select>
            </Form.Group>
          </ListGroup.Item>

          {/* Save Button */}
          <ListGroup.Item>
            <div className="d-flex justify-content-end">
              <Button variant="primary">
                Save Changes
              </Button>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
};

export default Settings;