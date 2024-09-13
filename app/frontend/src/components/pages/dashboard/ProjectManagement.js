import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSort, FaGithub, FaExternalLinkAlt, FaToggleOn, FaToggleOff, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [isExpanded, setIsExpanded] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['x-auth-token'] = storedToken;
    }
  }, []);

  useEffect(() => {
    if (isExpanded && token) {
      fetchProjects();
    }
  }, [isExpanded, token]);

  const fetchProjects = async () => {
    try {
      const projectsResponse = await axios.get('http://localhost:5000/api/projects', {
        headers: { 'x-auth-token': token }
      });
      const projectsWithViews = await Promise.all(projectsResponse.data.map(async (project) => {
        const viewsResponse = await axios.get(`http://localhost:5000/api/views/project/${project._id}`, {
          headers: { 'x-auth-token': token }
        });
        return { ...project, views: viewsResponse.data.projectViews };
      }));
      setProjects(projectsWithViews);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setProjects(projects.filter(project => project._id !== id));
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleToggleFeatured = async (id, currentFeaturedStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/projects/${id}`, {
        featured: !currentFeaturedStatus
      }, {
        headers: { 'x-auth-token': token }
      });
      setProjects(projects.map(project => 
        project._id === id ? { ...project, featured: !currentFeaturedStatus } : project
      ));
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Failed to update featured status. Please try again.');
    }
  };

  const sortProjects = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedProjects = [...projects].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setProjects(sortedProjects);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-muted p-6 rounded-xl shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">Project Management</h2>
        <button
          onClick={toggleExpand}
          className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary transition duration-300 flex items-center"
        >
          {isExpanded ? <FaChevronUp className="mr-2" /> : <FaChevronDown className="mr-2" />}
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
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
              <div className="text-center py-20">Loading projects...</div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">{error}</div>
            ) : (
              <>
                <div className="mb-4">
                  <Link to="/admin/projects/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition duration-300 flex items-center inline-flex">
                    <FaPlus className="mr-2" /> Add New Project
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-darkpurple">
                        <th className="p-3 cursor-pointer" onClick={() => sortProjects('title')}>
                          Title <FaSort className="inline ml-1" />
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => sortProjects('status')}>
                          Status <FaSort className="inline ml-1" />
                        </th>
                        <th className="p-3 cursor-pointer" onClick={() => sortProjects('views')}>
                          Views <FaSort className="inline ml-1" />
                        </th>
                        <th className="p-3">GitHub</th>
                        <th className="p-3">Live Demo</th>
                        <th className="p-3">Featured</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project._id} className="border-b border-gray-700">
                          <td className="p-3">{project.title}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              project.status === 'completed' ? 'bg-green-500' :
                              project.status === 'wip' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="p-3">{project.views || 0}</td>
                          <td className="p-3">
                            {project.github ? (
                              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary">
                                <FaGithub />
                              </a>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="p-3">
                            {project.live ? (
                              <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary">
                                <FaExternalLinkAlt />
                              </a>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleFeatured(project._id, project.featured)}
                              className="text-2xl focus:outline-none"
                            >
                              {project.featured ? (
                                <FaToggleOn className="text-primary" />
                              ) : (
                                <FaToggleOff className="text-gray-500" />
                              )}
                            </button>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Link 
                                to={`/admin/projects/${project._id}`} 
                                className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary transition duration-300"
                              >
                                <FaEdit />
                              </Link>
                              <button 
                                onClick={() => handleDeleteProject(project._id)} 
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectManagement;