import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaCheckCircle, FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid'; // Make sure to install this package: npm install uuid

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    const recordProjectView = async () => {
      try {
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
          sessionId = uuidv4();
          localStorage.setItem('sessionId', sessionId);
        }
        await axios.post('/api/views', { projectId: id, sessionId });
      } catch (error) {
        console.error('Error recording project view:', error);
      }
    };

    recordProjectView();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project. Please try again later.');
      setLoading(false);
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    if (location.state?.from === "/") {
      navigate('/');
      setTimeout(() => {
        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
          portfolioSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(location.state?.from || "/projects");
    }
  };

  if (loading) {
    return <div className="text-white text-center pt-32">Loading project details...</div>;
  }

  if (error) {
    return <div className="text-white text-center pt-32">{error}</div>;
  }

  if (!project) {
    return <div className="text-white text-center pt-32">Project not found.</div>;
  }

  const tabVariants = {
    inactive: { y: 0, opacity: 0.7 },
    active: { y: -5, opacity: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const tabContent = {
    details: (
      <motion.div
        key="details"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-primary mb-4">Project Details</h2>
        <p className="text-text">{project.details}</p>
      </motion.div>
    ),
    skills: (
      <motion.div
        key="skills"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-primary mb-4">Skills Used</h2>
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill, index) => (
            <span key={index} className="bg-secondary text-text px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    ),
    learned: (
      <motion.div
        key="learned"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-primary mb-4">What I Learned</h2>
        <p className="text-text">{project.learned}</p>
      </motion.div>
    ),
    media: (
      <motion.div
        key="media"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-primary mb-4">Project Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.media && project.media.length > 0 ? (
            project.media.map((item, index) => (
              <div key={index} className="bg-background rounded-lg overflow-hidden shadow-md">
                {item.type === 'image' ? (
                  <img src={item.url} alt={`Project media ${index + 1}`} className="w-full h-48 object-cover" />
                ) : (
                  <video src={item.url} controls className="w-full h-48 object-cover">
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))
          ) : (
            <p className="text-text">No media available for this project.</p>
          )}
        </div>
      </motion.div>
    ),
  };

  return (
    <div className="pt-32 bg-gradient-to-br from-darkblue via-muted to-darkpurple min-h-screen relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-muted rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <div 
            onClick={handleBackClick}
            className="inline-block mb-4 cursor-pointer"
          >
            <motion.div
              className="flex items-center text-primary hover:text-secondary transition-colors duration-300"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to {location.state?.from === "/" ? "Home" : "Projects"}</span>
            </motion.div>
          </div>

          <h1 className="text-4xl font-bold text-primary mb-4">{project.title}</h1>
          <p className="text-xl text-text mb-6">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <img src={project.image} alt={project.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
            </div>
            <div className="flex flex-col justify-between">
              <div className="grid grid-cols-1 gap-4">
                <motion.div 
                  className="flex items-center p-2 rounded-lg"
                  whileHover={{ y: -5, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  <FaCalendar className="text-primary text-3xl mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Timeline</h3>
                    <p className="text-text">{project.timeline}</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center p-2 rounded-lg"
                  whileHover={{ y: -5, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  <FaCheckCircle className="text-primary text-3xl mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Status</h3>
                    <p className="text-text capitalize">{project.status}</p>
                  </div>
                </motion.div>
              </div>
              <div className="flex justify-between items-center mt-4">
                {project.github ? (
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-text px-6 py-2 rounded-lg hover:bg-secondary transition duration-300 flex items-center space-x-2"
                    whileHover={{ 
                      backgroundColor: "#4a5568", 
                      boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                      y: -2
                    }}
                    whileTap={{ 
                      backgroundColor: "#2d3748",
                      y: 1
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 10 
                    }}
                  >
                    <FaGithub />
                    <span>View Code</span>
                  </motion.a>
                ) : (
                  <motion.div
                    className="bg-gray-600 text-text px-6 py-2 rounded-lg flex items-center space-x-2 cursor-not-allowed"
                    whileHover={{ 
                      backgroundColor: "#4a5568",
                      boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                      y: -2
                    }}
                    whileTap={{ 
                      backgroundColor: "#2d3748",
                      y: 1
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 10 
                    }}
                  >
                    <FaGithub />
                    <span>Private Repo</span>
                  </motion.div>
                )}
                {project.live ? (
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-text px-6 py-2 rounded-lg hover:bg-secondary transition duration-300 flex items-center space-x-2"
                    whileHover={{ 
                      backgroundColor: "#4a5568", 
                      boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                      y: -2
                    }}
                    whileTap={{ 
                      backgroundColor: "#2d3748",
                      y: 1
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 10 
                    }}
                  >
                    <FaExternalLinkAlt />
                    <span>Live Demo</span>
                  </motion.a>
                ) : (
                  <motion.div
                    className="bg-gray-600 text-text px-6 py-2 rounded-lg flex items-center space-x-2 cursor-not-allowed"
                    whileHover={{ 
                      backgroundColor: "#4a5568",
                      boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                      y: -2
                    }}
                    whileTap={{ 
                      backgroundColor: "#2d3748",
                      y: 1
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 10 
                    }}
                  >
                    <FaExternalLinkAlt />
                    <span>No Live Demo</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex border-b border-gray-600">
              {['details', 'skills', 'learned', 'media'].map((tab) => (
                <motion.button
                  key={tab}
                  className={`px-4 py-2 ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-text'}`}
                  onClick={() => setActiveTab(tab)}
                  variants={tabVariants}
                  initial="inactive"
                  animate={activeTab === tab ? "active" : "inactive"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </div>
            <div className="mt-4">
              <AnimatePresence mode="wait">
                {tabContent[activeTab]}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetail;