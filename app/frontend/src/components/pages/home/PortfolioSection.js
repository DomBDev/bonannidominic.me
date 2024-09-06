import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const projects = [
  {
    id: 1,
    title: "bonannidominic.me",
    description: "My personal portfolio website showcasing my projects and skills.",
    image: "/images/portfolio-project.jpg",
    tags: ["Next.js", "Tailwind CSS"],
    github: "https://github.com/DomBDev/bonannidominic.me",
    live: "https://bonannidominic.me",
    details: "This project highlights my skills as a developer. It includes various sections demonstrating my work and technologies I'm proficient in."
  },
  {
    id: 2,
    title: "HomeCommand",
    description: "A fully wireless home automation system, designed to centralize and manage your smart devices seamlessly.",
    image: "/images/home-command.jpg",
    tags: ["Raspberry Pi", "ESP32", "Python", "Flask"],
    details: "This project integrates an RPI and ESP32s to create a real-time communication system for home automation. It showcases my ability to work with hardware and software integration."
  },
  {
    id: 3,
    title: "Bubblefy",
    description: "Immerse yourself in the world of coding with our interactive learning app.",
    image: "/images/bubblefy.jpg",
    tags: ["CSS", "JavaScript"],
    github: "https://github.com/DomBDev/Bubblefy",
    details: "This project is an interactive learning app that helps users discover diverse programming topics and explore in-depth subtopics with ease."
  },
  {
    id: 4,
    title: "pineelite.com",
    description: "A business portfolio demonstration, showcasing API calls and a multiplayer HTML5 game using PeerJS.",
    image: "/images/pineelite.jpg",
    tags: ["HTML", "CSS", "JavaScript", "PeerJS"],
    github: "https://github.com/DomBDev/pineelite.com",
    details: "This project demonstrates my ability to create a business portfolio with interactive features and multiplayer capabilities."
  },
  {
    id: 5,
    title: "ImageFxInc",
    description: "A Flask/Python website tailored for business needs, offering a seamless user experience and powerful functionality.",
    image: "/images/imagefxinc.jpg",
    tags: ["Flask", "Python", "CSS"],
    details: "This project showcases my skills in building dynamic business websites with Flask and Python, providing a robust and user-friendly interface."
  },
  {
    id: 6,
    title: "GCbaseball",
    description: "A dynamic soundboard website for the local baseball team, utilizing Flask for back-end management.",
    image: "/images/gcbaseball.jpg",
    tags: ["Flask", "Python", "JavaScript"],
    details: "This project demonstrates my ability to create dynamic web applications with Flask, providing a soundboard for a local baseball team."
  }
];

const PortfolioSection = () => {
  const [selectedProject, setSelectedProject] = useState(null);

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
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={projectVariants}
              className="bg-muted rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
            >
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-text mb-2">{project.title}</h3>
                <p className="text-text mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="bg-secondary text-text text-sm px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="bg-primary text-text px-4 py-2 rounded-lg hover:bg-secondary transition duration-300"
                  >
                    Learn More
                  </button>
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

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-muted rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-visible"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl font-bold text-primary mb-4">{selectedProject.title}</h3>
              <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-64 object-cover rounded-lg mb-6" />
              <p className="text-text mb-6">{selectedProject.details}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tags.map((tag, index) => (
                  <span key={index} className="bg-secondary text-text text-sm px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                {selectedProject.github ? (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-text px-6 py-2 rounded-lg hover:bg-secondary transition duration-300 flex items-center space-x-2"
                  >
                    <FaGithub />
                    <span>View Code</span>
                  </a>
                ) : (
                  <div className="bg-black text-text px-6 py-2 rounded-lg hover:bg-secondary transition duration-300 flex items-center space-x-2 relative group">
                    <FaGithub />
                    <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-visible">
                      This project does not have a public repository.
                    </div>
                    <span className="text-text">View Code</span>
                  </div>
                )}
                {selectedProject.live ? (
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-text px-6 py-2 rounded-lg hover:bg-secondary transition duration-300 flex items-center space-x-2"
                  >
                    <FaExternalLinkAlt />
                    <span>Live Demo</span>
                  </a>
                ) : (
                  <div className="bg-black text-text px-6 py-2 rounded-lg hover:bg-secondary transition duration-300 flex items-center space-x-2 relative group">
                    <FaExternalLinkAlt />
                    <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-visible">
                      This project does not have a live demo.
                    </div>
                    <span className="text-text">Live Demo</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioSection;