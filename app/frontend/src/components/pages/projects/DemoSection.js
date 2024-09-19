import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectDemo from './ProjectDemo';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ children, onClose }) => {
    useEffect(() => {
      const handleEsc = (event) => {
        if (event.keyCode === 27) onClose();
      };
      window.addEventListener('keydown', handleEsc);
  
      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    }, [onClose]);
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background rounded-lg shadow-lg w-full max-w-4xl h-[90vh] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-primary hover:text-text transition-colors text-2xl"
          >
            <FaTimes />
          </button>
          {children}
        </motion.div>
      </motion.div>
    );
  };

const DemoSection = ({ demoProjects }) => {
  const [expandedDemo, setExpandedDemo] = useState(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-7xl mx-auto px-4 py-16 mt-16 relative z-10"
    >
      <div className="bg-background bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-8 text-center">The Playground</h2>
        <p className="text-xl text-center text-text mb-12">
          Explore interactive demos of cutting-edge projects and experiments.
        </p>
        <div className="grid grid-cols-1 gap-8">
          {demoProjects.map((demo) => (
            <ProjectDemo 
              key={demo.id} 
              demo={demo} 
              onExpand={setExpandedDemo}
            />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {expandedDemo && (
          <Modal onClose={() => setExpandedDemo(null)}>
            <div className="w-full h-full bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="bg-secondary p-4">
                <h4 className="text-primary font-bold text-xl">{expandedDemo.title}</h4>
              </div>
              <div className="p-4 h-[calc(100%-8rem)]">
                {expandedDemo.component}
              </div>
              <div className="bg-secondary p-4">
                <p className="text-text">{expandedDemo.description}</p>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default DemoSection;