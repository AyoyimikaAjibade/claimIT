import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClaimList = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/claims/`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      setClaims(response.data);
    } catch (err) {
      console.error("Error fetching claims", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  if (loading) {
    return <p>Loading claims...</p>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Your Claims</h4>
        {claims.length === 0 ? (
          <p>No claims found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Disaster Type</th>
                  <th>Property Type</th>
                  <th>Description</th>
                  <th>Estimated Loss</th>
                  <th>Status</th>
                  <th>Predicted Approval</th>
                  <th>Predicted Limit</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {claims.map(claim => (
                  <tr key={claim.id}>
                    <td>{claim.id}</td>
                    <td>{claim.disaster_type}</td>
                    <td>{claim.property_type}</td>
                    <td>{claim.description}</td>
                    <td>${claim.estimated_loss}</td>
                    <td>{claim.status}</td>
                    <td>{claim.predicted_approval ? claim.predicted_approval : 'N/A'}</td>
                    <td>{claim.predicted_limit ? `$${claim.predicted_limit}` : 'N/A'}</td>
                    <td>{new Date(claim.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimList;
