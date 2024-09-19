import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaLock } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const ProjectSection = ({ category, projects, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="relative z-10 border-t-8 border-background">
      <div className="grid grid-cols-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, delay: 0.2, ease: 'easeInOut' }}
          className="bg-gradient-to-l from-darkpurple from-5% via-muted via-50% to-darkblue shadow-lg p-4 flex justify-center items-center cursor-pointer border-t-2 border-b-2 border-secondary hover:border-primary transition-colors duration-300"
          onClick={toggleDropdown}
        >
          <div className="flex items-center w-full h-16 sm:h-24 justify-between max-w-7xl mx-auto px-2 sm:px-4">
            <h2 className="text-xl sm:text-3xl font-bold text-primary">{category}</h2>
            <div
              className={`ml-2 sm:ml-4 text-primary text-xl sm:text-2xl transform transition-transform duration-300 ${
                isOpen ? 'rotate-90' : ''
              }`}
            >
              &rarr;
            </div>
          </div>
        </motion.div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              {projects.map((project) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
                  className="relative bg-gradient-to-l from-secondary to-muted shadow-lg p-4 flex flex-col justify-center items-start transition-colors duration-300 group border-t-2 border-black"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center w-full pl-4 border-l-2 border-primary group max-w-7xl mx-auto">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="rounded-lg w-full sm:w-24 h-48 sm:h-24 object-cover mb-4 sm:mb-0 sm:mr-4"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="text-xl sm:text-2xl font-bold text-text">{project.title}</h3>
                      <p className="mt-2 text-base sm:text-lg text-text">{project.description}</p>
                      <div className="mt-2 flex items-center flex-wrap">
                        {project.skills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-primary text-background rounded-full px-2 py-1 text-xs sm:text-sm mr-2 mb-2"
                          >
                            {skill}
                          </span>
                        ))}
                        {project.skills.length > 5 && (
                          <span className="bg-primary text-background rounded-full px-2 py-1 text-xs sm:text-sm mr-2 mb-2">
                            ...
                          </span>
                        )}
                      </div>
                      <span className="mt-2 inline-block bg-secondary text-text px-2 py-1 rounded-full text-xs sm:text-sm">
                        {project.status}
                      </span>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4 text-primary text-2xl flex items-center relative">
                      <div className="group relative cursor-pointer">
                        <Link
                          to={`/projects/${project._id}`}
                          state={{ from: location.pathname }}
                          className="flex flex-row items-center gap-2"
                        >
                          {project.public ? <FaGlobe /> : <FaLock />}
                          <span>&rarr;</span>
                        </Link>
                        <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-min p-2 bg-gray-800 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          {project.public ? "Public Project" : "Private Project"}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectSection;