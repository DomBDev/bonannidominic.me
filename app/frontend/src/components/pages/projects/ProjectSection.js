import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaLock } from 'react-icons/fa';

const ProjectSection = ({ sectionTitle, projects, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState();

  useEffect(() => {
    if (defaultOpen) {
      setIsOpen(true);
    }
  }, [defaultOpen]);

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
          <div className="flex items-center w-full h-24 justify-between max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-primary">{sectionTitle}</h2>
            <div
              className={`ml-4 text-primary text-2xl transform transition-transform duration-300 ${
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
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeInOut' }}
                  className="relative bg-gradient-to-l from-secondary to-muted shadow-lg p-4 flex flex-col md:flex-row justify-center items-center transition-colors duration-300 group border-t-2 border-black"
                >
                  <div className="flex items-center w-full pl-4 border-l-2 border-primary group max-w-7xl mx-auto">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="rounded-lg w-24 h-24 object-cover mr-4"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="text-2xl font-bold text-text">{project.title}</h3>
                      <p className="mt-2 text-lg text-text">{project.description}</p>
                      <div className="mt-2 flex items-center flex-wrap">
                        {project.skills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-primary text-background rounded-full px-2 py-1 text-sm mr-2 mb-2"
                          >
                            {skill}
                          </span>
                        ))}
                        {project.skills.length > 5 && (
                          <span className="bg-primary text-background rounded-full px-2 py-1 text-sm mr-2 mb-2">
                            ...
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-primary text-2xl hidden md:flex items-center relative">
                      {project.public ? (
                        <div className="group relative cursor-pointer">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row items-center gap-2"
                          >
                            <FaGlobe />
                            &rarr;
                          </a>
                          <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-min p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Public Project
                          </div>
                        </div>
                      ) : (
                        <div className="group relative cursor-pointer">
                          <span>
                            <FaLock />
                          </span>
                          <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-min p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Private Project
                          </div>
                        </div>
                      )}
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