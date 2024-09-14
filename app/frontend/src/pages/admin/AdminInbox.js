import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaTrash, FaEnvelope, FaEnvelopeOpen, FaSort, FaEye } from 'react-icons/fa';
import AdminNav from './AdminNav';

const AdminInbox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/contacts?sortBy=${sortBy}&sortOrder=${sortOrder}&filter=${filter}`);
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Please try again.');
      setLoading(false);
    }
  }, [sortBy, sortOrder, filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleFilter = (filterType) => {
    setFilter(filterType);
  };

  const handleSelectMessage = (id) => {
    setSelectedMessages(prev => 
      prev.includes(id) ? prev.filter(msgId => msgId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map(msg => msg._id));
    }
  };

  const handleMarkAsRead = async (ids) => {
    try {
      await axios.put('http://localhost:5000/api/contacts/mark-read', { ids });
      fetchMessages();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleMarkAsUnread = async (ids) => {
    try {
      await axios.put('http://localhost:5000/api/contacts/mark-unread', { ids });
      fetchMessages();
    } catch (error) {
      console.error('Error marking messages as unread:', error);
    }
  };

  const handleDelete = async (ids) => {
    try {
      await axios.delete('http://localhost:5000/api/contacts', { data: { ids } });
      fetchMessages();
      setSelectedMessages([]);
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };

  const openMessageModal = (message) => {
    setSelectedMessage(message);
  };

  const closeMessageModal = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkblue via-muted to-darkpurple py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-bold text-primary mt-10">Admin Inbox</h1>
        <AdminNav />

        <div className="bg-muted rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="space-x-2 mb-2 sm:mb-0">
              <button onClick={() => handleFilter('all')} className={`px-3 py-1 rounded-full ${filter === 'all' ? 'bg-primary text-white' : 'bg-darkblue text-text'}`}>All</button>
              <button onClick={() => handleFilter('unread')} className={`px-3 py-1 rounded-full ${filter === 'unread' ? 'bg-primary text-white' : 'bg-darkblue text-text'}`}>Unread</button>
              <button onClick={() => handleFilter('read')} className={`px-3 py-1 rounded-full ${filter === 'read' ? 'bg-primary text-white' : 'bg-darkblue text-text'}`}>Read</button>
            </div>
            <div className="space-x-2">
              <button onClick={handleSelectAll} className="px-3 py-1 bg-secondary text-white rounded-full">Select All</button>
              <button onClick={() => handleMarkAsRead(selectedMessages)} className="px-3 py-1 bg-accent text-white rounded-full">Mark as Read</button>
              <button onClick={() => handleMarkAsUnread(selectedMessages)} className="px-3 py-1 bg-accent text-white rounded-full">Mark as Unread</button>
              <button onClick={() => handleDelete(selectedMessages)} className="px-3 py-1 bg-red-500 text-white rounded-full">Delete Selected</button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading messages...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-darkpurple">
                    <th className="p-3">Select</th>
                    <th className="p-3 cursor-pointer" onClick={() => handleSort('name')}>
                      Name <FaSort className="inline ml-1" />
                    </th>
                    <th className="p-3 cursor-pointer" onClick={() => handleSort('email')}>
                      Email <FaSort className="inline ml-1" />
                    </th>
                    <th className="p-3">Message</th>
                    <th className="p-3 cursor-pointer" onClick={() => handleSort('createdAt')}>
                      Date <FaSort className="inline ml-1" />
                    </th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(message => (
                    <tr 
                      key={message._id} 
                      className={`${
                        message.read 
                          ? 'bg-background text-text' 
                          : 'bg-darkblue text-white font-semibold'
                      } hover:bg-muted transition-colors duration-200`}
                    >
                      <td className="p-3">
                        <input 
                          type="checkbox" 
                          checked={selectedMessages.includes(message._id)}
                          onChange={() => handleSelectMessage(message._id)}
                          className="form-checkbox h-5 w-5 text-primary"
                        />
                      </td>
                      <td className="p-3 flex items-center">
                        {!message.read && (
                          <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                        )}
                        {message.name}
                      </td>
                      <td className="p-3">{message.email}</td>
                      <td className="p-3">
                        <div className="truncate max-w-xs">{message.message}</div>
                      </td>
                      <td className="p-3">{new Date(message.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <button 
                          onClick={() => message.read ? handleMarkAsUnread([message._id]) : handleMarkAsRead([message._id])} 
                          className={`mr-2 ${message.read ? 'text-text' : 'text-accent'} hover:text-primary`}
                        >
                          {message.read ? <FaEnvelopeOpen /> : <FaEnvelope />}
                        </button>
                        <button 
                          onClick={() => openMessageModal(message)} 
                          className="mr-2 text-primary hover:text-accent"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleDelete([message._id])} 
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
      <MessageModal message={selectedMessage} onClose={closeMessageModal} />
    </div>
  );
};

const MessageModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-muted rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Message Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-text">From:</h3>
            <p className="text-text">{message.name} ({message.email})</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text">Date:</h3>
            <p className="text-text">{new Date(message.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text">Message:</h3>
            <p className="text-text whitespace-pre-wrap">{message.message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-full hover:bg-accent transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminInbox;