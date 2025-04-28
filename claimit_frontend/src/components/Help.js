import React, { useState } from 'react';
import { Card, Accordion, Button, Form, InputGroup } from 'react-bootstrap';
import { 
  FaQuestionCircle, FaSearch, FaEnvelope, 
  FaPhone, FaComments, FaArrowRight 
} from 'react-icons/fa';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I file a new claim?',
      answer: 'To file a new claim, navigate to the "New Claim" section from the sidebar. Fill out the required information about your incident and submit any relevant documentation. Our team will review your claim within 24-48 hours.'
    },
    {
      question: 'What documents do I need for a claim?',
      answer: 'Required documents typically include: proof of identity, proof of residence, photos of damage, repair estimates, and any relevant police or incident reports. The specific requirements may vary based on the type of claim.'
    },
    {
      question: 'How long does the claim process take?',
      answer: 'Most claims are processed within 5-7 business days after all required documentation is received. Complex claims may take longer. You can check your claim status anytime in the "Claims" section.'
    },
    {
      question: 'Can I update an existing claim?',
      answer: 'Yes, you can update an existing claim by navigating to the "Claims" section and selecting the claim you wish to modify. You can add additional information or documentation as needed.'
    },
    {
      question: 'What if my claim is denied?',
      answer: 'If your claim is denied, you will receive a detailed explanation. You have the right to appeal the decision within 30 days by providing additional documentation or clarification through the appeals process.'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-4">
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <h4 className="mb-0">
            <FaQuestionCircle className="me-2 text-primary" />
            Help & Support
          </h4>
        </Card.Header>
        <Card.Body>
          <InputGroup className="mb-4">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <h5 className="mb-3">Frequently Asked Questions</h5>
          <Accordion>
            {filteredFaqs.map((faq, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>{faq.question}</Accordion.Header>
                <Accordion.Body>{faq.answer}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && (
            <p className="text-center text-muted my-4">
              No FAQs match your search. Please try different keywords or contact support.
            </p>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="bg-white">
          <h5 className="mb-0">Contact Support</h5>
        </Card.Header>
        <Card.Body>
          <div className="row g-4">
            <div className="col-md-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <FaEnvelope className="display-4 text-primary mb-3" />
                  <h5>Email Support</h5>
                  <p className="text-muted mb-3">Get help via email within 24 hours</p>
                  <Button variant="outline-primary" className="w-100">
                    Send Email <FaArrowRight className="ms-2" />
                  </Button>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <FaPhone className="display-4 text-primary mb-3" />
                  <h5>Phone Support</h5>
                  <p className="text-muted mb-3">Talk to an agent directly</p>
                  <Button variant="outline-primary" className="w-100">
                    Call Now <FaArrowRight className="ms-2" />
                  </Button>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <FaComments className="display-4 text-primary mb-3" />
                  <h5>Live Chat</h5>
                  <p className="text-muted mb-3">Chat with support in real-time</p>
                  <Button variant="outline-primary" className="w-100">
                    Start Chat <FaArrowRight className="ms-2" />
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Help;