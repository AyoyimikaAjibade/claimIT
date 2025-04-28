import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUpload, FaFile, FaTimes, FaCheck } from 'react-icons/fa';
import '../styles/claims.css';

const ClaimForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [disasterType, setDisasterType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedLoss, setEstimatedLoss] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const PROPERTY_TYPE_CHOICES = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' }
  ];

  const DISASTER_TYPE_CHOICES = [
    { value: 'wildfire', label: 'Wildfire' },
    { value: 'flood', label: 'Flood' },
    { value: 'earthquake', label: 'Earthquake' },
    { value: 'hurricane', label: 'Hurricane' },
    { value: 'tornado', label: 'Tornado' }
  ];

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('disaster_type', disasterType);
      formData.append('property_type', propertyType);
      formData.append('description', description);
      formData.append('estimated_loss', estimatedLoss);
      
      files.forEach((file) => {
        formData.append('documents', file);
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/claims/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
          }
        }
      );

      setFeedback({
        type: 'success',
        predictedApproval: response.data.predicted_approval,
        predictedLimit: response.data.predicted_limit,
        status: response.data.status
      });

      // Clear form
      setDisasterType('');
      setPropertyType('');
      setDescription('');
      setEstimatedLoss('');
      setFiles([]);
      setCurrentStep(1);
    } catch (err) {
      console.error("Error submitting claim", err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || "Failed to submit claim."
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="progress-steps">
      <div className="progress-line">
        <div 
          className="progress-line-fill" 
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
        />
      </div>
      <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
        <div className="step-number">1</div>
        <div className="step-label">Basic Info</div>
      </div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
        <div className="step-number">2</div>
        <div className="step-label">Details</div>
      </div>
      <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <div className="step-label">Documents</div>
      </div>
    </div>
  );

  return (
    <Container fluid className="claims-container">
      <h2 className="claims-title">File a New Claim</h2>
      <Card className="claim-form-card">
        <Card.Body>
          {renderStepIndicator()}
          
          <Form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="form-section">
                <h3 className="section-title">Basic Information</h3>
                <Form.Group className="mb-4">
                  <Form.Label>Disaster Type</Form.Label>
                  <Form.Select
                    value={disasterType}
                    onChange={(e) => setDisasterType(e.target.value)}
                    required
                  >
                    <option value="">Select Disaster Type</option>
                    {DISASTER_TYPE_CHOICES.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Property Type</Form.Label>
                  <Form.Select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    required
                  >
                    <option value="">Select Property Type</option>
                    {PROPERTY_TYPE_CHOICES.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button 
                    variant="primary"
                    onClick={() => setCurrentStep(2)}
                    disabled={!disasterType || !propertyType}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-section">
                <h3 className="section-title">Claim Details</h3>
                <Form.Group className="mb-4">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Provide a detailed description of the damage..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Estimated Loss ($)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter estimated monetary loss"
                    value={estimatedLoss}
                    onChange={(e) => setEstimatedLoss(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-primary"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={() => setCurrentStep(3)}
                    disabled={!description || !estimatedLoss}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-section">
                <h3 className="section-title">Supporting Documents</h3>
                <div
                  className="file-upload-area"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  <FaUpload className="file-upload-icon" />
                  <p>Drag and drop files here or</p>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-input"
                  />
                  <Button
                    variant="outline-primary"
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    Browse Files
                  </Button>
                </div>

                {files.length > 0 && (
                  <div className="file-list">
                    {files.map((file, index) => (
                      <div key={index} className="file-item">
                        <FaFile className="file-item-icon" />
                        <span className="file-item-name">{file.name}</span>
                        <FaTimes
                          className="file-item-remove"
                          onClick={() => removeFile(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="outline-primary"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </Button>
                  <Button 
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Claim'}
                  </Button>
                </div>
              </div>
            )}
          </Form>

          {feedback && (
            <Alert 
              variant={feedback.type === 'success' ? 'success' : 'danger'}
              className="mt-4"
            >
              {feedback.type === 'success' ? (
                <>
                  <Alert.Heading>
                    <FaCheck className="me-2" />
                    Claim Submitted Successfully
                  </Alert.Heading>
                  <p className="mb-0">Status: {feedback.status}</p>
                  <p className="mb-0">Predicted Approval: {feedback.predictedApproval}</p>
                  <p className="mb-0">Predicted Limit: ${feedback.predictedLimit}</p>
                </>
              ) : (
                <>
                  <Alert.Heading>Error</Alert.Heading>
                  <p className="mb-0">{feedback.message}</p>
                </>
              )}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClaimForm;
