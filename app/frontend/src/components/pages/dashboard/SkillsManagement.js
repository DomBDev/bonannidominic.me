import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSort, FaToggleOn, FaToggleOff, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SkillsManagement = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      fetchSkills();
    }
  }, [isExpanded]);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/skills');
      setSkills(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await axios.delete(`http://localhost:5000/api/skills/${id}`);
        setSkills(skills.filter(skill => skill._id !== id));
      } catch (err) {
        console.error('Error deleting skill:', err);
        alert('Failed to delete skill. Please try again.');
      }
    }
  };

  const handleToggleCore = async (id, currentCoreStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/skills/${id}`, {
        isCore: !currentCoreStatus
      });
      setSkills(skills.map(skill => 
        skill._id === id ? { ...skill, isCore: !currentCoreStatus } : skill
      ));
    } catch (error) {
      console.error('Error toggling core status:', error);
      alert('Failed to update core status. Please try again.');
    }
  };

  const sortSkills = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedSkills = [...skills].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setSkills(sortedSkills);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-muted p-6 rounded-xl shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">Skills Management</h2>
        <div className="flex space-x-2">
            <Link to="/admin/skills" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition duration-300 flex items-center">
                <FaEdit className="mr-2" /> Edit Skills
            </Link>
            <button
            onClick={toggleExpand}
            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary transition duration-300 flex items-center"
            >
            {isExpanded ? <FaChevronUp className="mr-2" /> : <FaChevronDown className="mr-2" />}
            {isExpanded ? 'Collapse' : 'Expand'}
            </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {loading ? (
              <div className="text-center py-20">Loading skills...</div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-darkpurple">
                      <th className="p-3 cursor-pointer" onClick={() => sortSkills('name')}>
                        Name <FaSort className="inline ml-1" />
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => sortSkills('category')}>
                        Category <FaSort className="inline ml-1" />
                      </th>
                      <th className="p-3">Icon</th>
                      <th className="p-3">Core Skill</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill) => (
                      <tr key={skill._id} className="border-b border-gray-700">
                        <td className="p-3">{skill.name}</td>
                        <td className="p-3">{skill.category}</td>
                        <td className="p-3">
                          <span className="text-2xl" style={{ color: skill.color }}>
                            <i className={skill.icon}></i>
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleCore(skill._id, skill.isCore)}
                            className="text-2xl focus:outline-none"
                          >
                            {skill.isCore ? (
                              <FaToggleOn className="text-primary" />
                            ) : (
                              <FaToggleOff className="text-gray-500" />
                            )}
                          </button>
                        </td>
                        <td className="p-3">
                          <button 
                            onClick={() => handleDeleteSkill(skill._id)} 
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsManagement;