import React, { useState, useEffect, useContext } from 'react';
import { Card, Badge, Button, ListGroup, Toast } from 'react-bootstrap';
import { FaBell, FaCheck, FaTrash, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const { authToken, user } = useContext(AuthContext);
  const isAdmin = user && user.is_staff;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/notifications/`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      setNotifications(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchNotifications();
      
      // Set up polling to refresh notifications every minute
      const intervalId = setInterval(fetchNotifications, 60000);
      
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [authToken]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/api/notifications/${id}/mark_as_read/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      setNotifications(notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      ));
      
      showToast('Notification marked as read', 'success');
    } catch (err) {
      console.error('Error marking notification as read:', err);
      showToast('Failed to mark notification as read', 'danger');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/notifications/${id}/`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      setNotifications(notifications.filter(notif => notif.id !== id));
      showToast('Notification deleted', 'success');
    } catch (err) {
      console.error('Error deleting notification:', err);
      showToast('Failed to delete notification', 'danger');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/notifications/mark_all_as_read/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      showToast('Failed to mark all notifications as read', 'danger');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'danger': return 'danger';
      default: return 'primary';
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  return (
    <div className="container py-4">
      <Toast 
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        delay={3000}
        autohide
        style={{ 
          position: 'fixed', 
          top: 20, 
          right: 20,
          zIndex: 9999
        }}
        bg={toast.type}
      >
        <Toast.Body className="text-white">{toast.message}</Toast.Body>
      </Toast>
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex align-items-center">
            <FaBell className="me-2 text-primary" />
            <h4 className="mb-0 me-2">
              Notifications
            </h4>
            {getUnreadCount() > 0 && (
              <Badge bg="primary" pill className="ms-2">
                {getUnreadCount()} New
              </Badge>
            )}
          </div>
          <div>
            {isAdmin && (
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => {
                  // Open modal or redirect to create notification page
                  // For now, we'll just show a toast
                  showToast('Create notification feature coming soon', 'info');
                }}
              >
                Create Notification
              </Button>
            )}
            <Button
              variant="link"
              size="sm"
              onClick={markAllAsRead}
              disabled={getUnreadCount() === 0}
            >
              Mark all as read
            </Button>
          </div>
        </Card.Header>
        {loading ? (
          <ListGroup.Item className="text-center py-4">
            <FaSpinner className="fa-spin" />
          </ListGroup.Item>
        ) : error ? (
          <ListGroup.Item className="text-center py-4">
            <p className="text-danger mb-0">{error}</p>
          </ListGroup.Item>
        ) : (
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
                      <small className="text-muted">
                        {moment(notification.created_at).fromNow()}
                      </small>
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
        )}
      </Card>
    </div>
  );
};

export default Notifications;