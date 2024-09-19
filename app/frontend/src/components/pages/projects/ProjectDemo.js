import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaExpandAlt } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const ProjectDemo = ({ demo, onExpand }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <motion.div
      ref={ref}
      layout
      className="bg-background rounded-lg shadow-lg overflow-hidden"
    >
      <div className="bg-secondary p-4 flex justify-between items-center">
        <h4 className="text-primary font-bold text-xl">{demo.title}</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => onExpand(demo)}
            className="text-primary hover:text-text transition-colors text-2xl p-2 rounded-full hover:bg-opacity-20 hover:bg-primary"
            aria-label="Expand demo"
          >
            <FaExpandAlt />
          </button>
          <button
            onClick={toggleOpen}
            className="text-primary hover:text-text transition-colors text-2xl p-2 rounded-full hover:bg-opacity-20 hover:bg-primary"
            aria-label={isOpen ? "Close demo" : "Open demo"}
          >
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 min-h-[300px]">
              {inView && demo.component}
            </div>
            <div className="bg-secondary p-4">
              <p className="text-text">{demo.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDemo;