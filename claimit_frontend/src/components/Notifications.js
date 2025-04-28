import React, { useState } from 'react';
import { Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Claim Update',
      message: 'Your claim #1234 has been approved',
      type: 'success',
      date: '2025-04-27',
      read: false
    },
    {
      id: 2,
      title: 'New Disaster Alert',
      message: 'New flood warning in your area',
      type: 'warning',
      date: '2025-04-26',
      read: false
    },
    {
      id: 3,
      title: 'Document Required',
      message: 'Please upload additional documentation for claim #5678',
      type: 'info',
      date: '2025-04-25',
      read: true
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'primary';
    }
  };

  return (
    <div className="container py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <h4 className="mb-0">
            <FaBell className="me-2 text-primary" />
            Notifications
          </h4>
          <Badge bg="primary" pill>
            {notifications.filter(n => !n.read).length} New
          </Badge>
        </Card.Header>
        <ListGroup variant="flush">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <ListGroup.Item
                key={notification.id}
                className={`border-bottom ${!notification.read ? 'bg-light' : ''}`}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="me-3">
                    <div className="d-flex align-items-center">
                      <Badge 
                        bg={getTypeColor(notification.type)}
                        className="me-2"
                      >
                        {notification.type}
                      </Badge>
                      <h6 className="mb-0">{notification.title}</h6>
                    </div>
                    <p className="mb-1 mt-1">{notification.message}</p>
                    <small className="text-muted">{notification.date}</small>
                  </div>
                  <div className="d-flex">
                    {!notification.read && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <FaCheck />
                      </Button>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="text-center py-4">
              <p className="text-muted mb-0">No notifications</p>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </div>
  );
};

export default Notifications;