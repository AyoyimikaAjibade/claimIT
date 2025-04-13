import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, FaFileAlt, FaUser, FaChartLine, 
  FaNewspaper, FaCog, FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link active">
              <FaHome className="me-2" />
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/claims" className="nav-link">
              <FaFileAlt className="me-2" />
              Claims
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/claim/new" className="nav-link">
              <FaChartLine className="me-2" />
              New Claim
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              <FaUser className="me-2" />
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/disaster-updates" className="nav-link">
              <FaNewspaper className="me-2" />
              Disaster Updates
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/settings" className="nav-link">
              <FaCog className="me-2" />
              Settings
            </Link>
          </li>
          <li className="nav-item mt-4">
            <Link to="/logout" className="nav-link text-danger">
              <FaSignOutAlt className="me-2" />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;