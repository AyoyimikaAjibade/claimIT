import React, { useState } from 'react';
import axios from 'axios';

const ClaimForm = () => {
  const [disasterType, setDisasterType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedLoss, setEstimatedLoss] = useState('');
  const [feedback, setFeedback] = useState(null);

  const PROPERTY_TYPE_CHOICES = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/claims/`, {
        disaster_type: disasterType,
        property_type: propertyType,
        description: description,
        estimated_loss: estimatedLoss
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      setFeedback({
        predictedApproval: response.data.predicted_approval,
        predictedLimit: response.data.predicted_limit,
        status: response.data.status
      });
      // Clear the form fields
      setDisasterType('');
      setPropertyType('');
      setDescription('');
      setEstimatedLoss('');
    } catch (err) {
      console.error("Error submitting claim", err);
      setFeedback({ error: "Failed to submit claim." });
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h4 className="card-title">File a New Claim</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Disaster Type:</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., wildfire, flood"
              value={disasterType}
              onChange={(e) => setDisasterType(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Property Type:</label>
            <select
              className="form-control"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">Select Property Type</option>
              {PROPERTY_TYPE_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Description:</label>
            <textarea
              className="form-control"
              placeholder="Describe the damage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>
          <div className="mb-3">
            <label>Estimated Loss:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Estimated monetary loss"
              value={estimatedLoss}
              onChange={(e) => setEstimatedLoss(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Submit Claim</button>
        </form>
        {feedback && (
          <div className="alert alert-info mt-3">
            {feedback.error ? (
              <p className="text-danger">{feedback.error}</p>
            ) : (
              <>
                <p>Status: {feedback.status}</p>
                <p>Predicted Approval: {feedback.predictedApproval}</p>
                <p>Predicted Limit: ${feedback.predictedLimit}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimForm;
