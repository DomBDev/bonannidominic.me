import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaEllipsisH } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const PortfolioSection = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        setProjects(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const projectVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const MAX_TAGS = 4;

  if (isLoading) return <section id="portfolio" className="py-20 bg-gradient-to-br from-darkpurple via-transparent via-10% to-muted mx-12 rounded-md">Loading...</section>
  if (error) return <section id="portfolio" className="py-20 bg-gradient-to-br from-darkpurple via-transparent via-10% to-muted mx-12 rounded-md">Error loading projects.</section>

  return (
    <section id="portfolio" className="py-20 bg-gradient-to-br from-darkpurple via-transparent via-10% to-muted mx-12 rounded-md">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-primary text-center mb-16"
        >
          My Portfolio
        </motion.h2>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.filter(project => project.featured).map((project) => (
            <motion.div
              key={project._id}
              variants={projectVariants}
              className="bg-muted rounded-xl shadow-lg transform transition duration-300 hover:scale-105 flex flex-col"
            >
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-t-xl" />
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-text mb-2">{project.title}</h3>
                <p className="text-text mb-4 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.slice(0, MAX_TAGS).map((tag, index) => (
                    <span key={index} className="bg-secondary text-text text-sm px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {project.skills.length > MAX_TAGS && (
                    <span className="bg-secondary text-text text-sm px-2 py-1 rounded-full flex items-center">
                      <FaEllipsisH className="mr-1" />
                      +{project.skills.length - MAX_TAGS}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <Link
                    to={`/projects/${project._id}`}
                    state={{ from: location.pathname }}
                    className="bg-primary text-text px-4 py-2 rounded-lg hover:bg-secondary transition duration-300"
                  >
                    Learn More
                  </Link>
                  <div className="flex space-x-4">
                    <div className="group relative">
                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text hover:text-primary transition duration-300"
                        >
                          <FaGithub size={24} />
                        </a>
                      ) : (
                        <div className="text-darkblue bg-white rounded-full shadow-lg text-center transform transition hover:bg-primary duration-300">
                          <FaGithub size={24} />
                          <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            This project does not have a public repository.
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="group relative">
                      {project.live ? (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text hover:text-primary transition duration-300"
                        >
                          <FaExternalLinkAlt size={24} />
                        </a>
                      ) : (
                        <div className="text-darkblue rounded shadow-lg text-center transform transition hover:text-primary duration-300">
                          <FaExternalLinkAlt size={24} />
                          <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            This project does not have a live demo.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;