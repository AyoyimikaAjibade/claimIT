import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaHome, 
  FaClipboardList, 
  FaFileInvoiceDollar,
  FaUserCircle,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaExclamationTriangle,
  FaBook,
  FaQuestionCircle,
  FaBars,
} from 'react-icons/fa';
import axios from 'axios';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, authToken } = useContext(AuthContext);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!authToken) return;
      
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/notifications/unread_count/`,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    
    // Set up polling to refresh count every minute
    const intervalId = setInterval(fetchUnreadCount, 60000);
    
    return () => clearInterval(intervalId);
  }, [authToken]);

  const menuGroups = [
    {
      title: 'Main',
      items: [
        { 
          path: '/dashboard', 
          icon: FaHome, 
          label: 'Dashboard'
        },
        {
          label: 'Claims',
          icon: FaClipboardList,
          submenu: [
            { path: '/claims', label: 'View Claims', icon: FaFileInvoiceDollar },
            { path: '/claim/new', label: 'New Claim', icon: FaFileInvoiceDollar }
          ]
        }
      ]
    },
    {
      title: 'Updates',
      items: [
        {
          path: '/disaster-updates',
          icon: FaExclamationTriangle,
          label: 'Disaster Updates'
        },
        {
          path: '/notifications',
          icon: FaBell,
          label: 'Notifications',
          badge: unreadCount > 0 ? unreadCount.toString() : null
        }
      ]
    },
    {
      title: 'Resources',
      items: [
        {
          path: '/resources',
          icon: FaBook,
          label: 'Resources'
        },
        {
          path: '/help',
          icon: FaQuestionCircle,
          label: 'Help & Support'
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          path: '/profile',
          icon: FaUserCircle,
          label: 'Profile'
        },
        {
          path: '/settings',
          icon: FaCog,
          label: 'Settings'
        }
      ]
    }
  ];

  const toggleSubmenu = (menuLabel) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuLabel]: !prev[menuLabel]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const renderMenuItem = (item) => {
    if (item.submenu) {
      const isExpanded = expandedMenus[item.label];
      return (
        <div key={item.label} className="nav-item">
          <button
            className="nav-link has-submenu"
            onClick={() => toggleSubmenu(item.label)}
          >
            <div className="menu-item-content">
              <item.icon className="nav-icon" />
              <span>{item.label}</span>
            </div>
            <FaChevronRight 
              className={`dropdown-arrow ${isExpanded ? 'open' : ''}`}
              aria-label={isExpanded ? 'Collapse menu' : 'Expand menu'}
            />
          </button>
          {isExpanded && (
            <div className="submenu">
              {item.submenu.map(subItem => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`nav-link ${location.pathname === subItem.path ? 'active' : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <div className="menu-item-content">
                    <subItem.icon className="nav-icon" />
                    <span>{subItem.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <li className="nav-item" key={item.path}>
        <Link
          to={item.path}
          className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => setIsMobileOpen(false)}
        >
          <div className="menu-item-content">
            <item.icon className="nav-icon" />
            <span>{item.label}</span>
          </div>
          {item.badge && (
            <span className="menu-badge">{item.badge}</span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      <button
        className="d-md-none btn btn-link sidebar-toggle"
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      <div className={`sidebar ${isMobileOpen ? 'show' : ''}`}>
        <div className="position-sticky">
          {menuGroups.map((group) => (
            <div key={group.title} className="menu-group">
              <h6 className="sidebar-heading">
                {group.title}
              </h6>
              <ul className="nav flex-column">
                {group.items.map(renderMenuItem)}
              </ul>
            </div>
          ))}
          
          <div className="menu-group mt-auto">
            <button
              onClick={handleLogout}
              className="nav-link text-danger border border-dark text-start d-flex align-items-center"
            >
              <FaSignOutAlt className="nav-icon" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;