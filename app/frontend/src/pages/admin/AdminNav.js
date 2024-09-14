import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChartBar, FaCode, FaInfoCircle, FaSignOutAlt, FaInbox } from 'react-icons/fa';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [showInboxTray, setShowInboxTray] = useState(false);
  const inboxTrayRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  const fetchUnreadMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts/', {
        params: {
          filter: 'unread',
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      });
      setUnreadCount(response.data.length);
      setUnreadMessages(response.data);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };

  const handleMarkAsRead = async (ids) => {
    try {
      await axios.put('http://localhost:5000/api/contacts/mark-read', { ids });
      // After marking as read, fetch the updated unread messages
      fetchUnreadMessages();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inboxTrayRef.current && !inboxTrayRef.current.contains(event.target)) {
        setShowInboxTray(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          handleLogout();
          return;
        }

        const response = await axios.post('http://localhost:5000/api/auth/check-token', {}, {
          headers: { 'x-auth-token': token }
        });

        if (response.data.isValid) {
          // Token is still valid, no action needed
        } else if (response.data.refreshedToken) {
          // Token was refreshed, update localStorage
          localStorage.setItem('token', response.data.refreshedToken);
        } else {
          // Token is invalid and couldn't be refreshed, log out
          handleLogout();
        }
      } catch (error) {
        console.error('Error checking token validity:', error);
        handleLogout();
      }
    };

    checkTokenValidity();
    const interval = setInterval(checkTokenValidity, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-muted p-4 rounded-xl shadow-lg mb-6">
      <ul className="flex justify-between items-center">
        <div className="flex space-x-4">
          <li>
            <Link
              to="/admin/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 ${
                isActive('/admin/dashboard') ? 'bg-primary text-white' : 'text-text hover:bg-darkblue'
              }`}
            >
              <FaChartBar />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/skills"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 ${
                isActive('/admin/skills') ? 'bg-primary text-white' : 'text-text hover:bg-darkblue'
              }`}
            >
              <FaCode />
              <span>Skills Editor</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/about"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-300 ${
                isActive('/admin/about') ? 'bg-primary text-white' : 'text-text hover:bg-darkblue'
              }`}
            >
              <FaInfoCircle />
              <span>About Editor</span>
            </Link>
          </li>
        </div>
        <div className="flex items-center space-x-4">
          <li className="relative" ref={inboxTrayRef}>
            <button
              onClick={() => setShowInboxTray(!showInboxTray)}
              className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-primary transition duration-300"
            >
              <FaInbox />
              <span>Inbox</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showInboxTray && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-darkblue rounded-lg shadow-lg z-10 overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-primary to-secondary">
                    <h3 className="text-lg font-semibold text-white mb-2">Unread Messages</h3>
                    <div className="h-1 w-full bg-white rounded-full"></div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {unreadMessages.length > 0 ? (
                      <ul className="space-y-2 p-4">
                        {unreadMessages.map((message) => (
                          <motion.li
                            key={message._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-muted p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-primary">{message.name}</span>
                              <span className="text-xs text-text">{new Date(message.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-text truncate">{message.message}</p>
                            <div className="mt-2 flex justify-end space-x-2">
                              <button
                                onClick={() => handleMarkAsRead([message._id])}
                                className="text-xs bg-accent text-white px-2 py-1 rounded hover:bg-primary transition duration-300"
                              >
                                Mark as Read
                              </button>
                              <button
                                onClick={() => navigate(`/admin/inbox?message=${message._id}`)}
                                className="text-xs bg-secondary text-white px-2 py-1 rounded hover:bg-primary transition duration-300"
                              >
                                View
                              </button>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center py-8 text-text">No unread messages</p>
                    )}
                  </div>
                  <div className="p-4 bg-gradient-to-r from-primary to-secondary">
                    <button
                      onClick={() => {
                        navigate('/admin/inbox');
                      }}
                      className="w-full px-4 py-2 bg-white text-primary rounded-lg hover:bg-accent hover:text-white transition duration-300 flex items-center justify-center"
                    >
                      <FaInbox className="mr-2" /> Go to Inbox
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default AdminNav;