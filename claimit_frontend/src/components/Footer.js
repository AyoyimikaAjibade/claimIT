import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const Footer = () => {
  return (
    <footer className="auth-footer mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5>About</h5>
            <ul className="auth-footer-links">
              <li><Link to="/about">About claimIT</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Use</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Customer Service</h5>
            <ul className="auth-footer-links">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/support">Support</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Keep In Touch</h5>
            <ul className="auth-footer-links">
              <li><a href="mailto:support@claimit.com">support@claimit.com</a></li>
              <li><a href="tel:+18002441180">(800) 244-1180</a></li>
            </ul>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} claimIT | All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;