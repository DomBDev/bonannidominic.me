import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const About = () => {
  const [timelineElements, setTimelineElements] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetchTimelineElements();
  }, []);

  const fetchTimelineElements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/timeline');
      setTimelineElements(response.data);
    } catch (error) {
      console.error('Error fetching timeline elements:', error);
    }
  };

  const calculateAge = (year) => {
    const birthDate = new Date('2006-09-02');
    const timelineDate = new Date(year, 0, 1);
    const age = timelineDate.getFullYear() - birthDate.getFullYear();
    return `${age - 1}-${age}`;
  };

  const navigateSection = useCallback((newSection) => {
    if (newSection >= 0 && newSection < timelineElements.length) {
      setDirection(newSection > currentSection ? 1 : -1);
      setCurrentSection(newSection);
    }
  }, [currentSection, timelineElements.length]);

  const handleScroll = useCallback((event) => {
    event.preventDefault();
    if (event.deltaY > 0 && currentSection < timelineElements.length - 1) {
      navigateSection(currentSection + 1);
    } else if (event.deltaY < 0 && currentSection > 0) {
      navigateSection(currentSection - 1);
    }
  }, [currentSection, navigateSection, timelineElements.length]);

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        {timelineElements.length > 0 && (
          <motion.div 
            key={currentSection}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={{
              enter: (direction) => ({
                x: direction > 0 ? '100%' : '-100%',
                opacity: 0
              }),
              center: {
                x: 0,
                opacity: 1
              },
              exit: (direction) => ({
                x: direction < 0 ? '100%' : '-100%',
                opacity: 0
              })
            }}
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.2 }
            }}
            className="w-full h-full absolute"
          >
            {timelineElements[currentSection].type === 'profile' && (
              <ProfileSection element={timelineElements[currentSection]} />
            )}
            {timelineElements[currentSection].type === 'future' && (
              <FuturePlansSection element={timelineElements[currentSection]} />
            )}
            {timelineElements[currentSection].type === 'event' && (
              <TimelineEventSection
                element={timelineElements[currentSection]}
                calculateAge={calculateAge}
              />
            )}
            {timelineElements[currentSection].type === 'current' && (
              <CurrentSection element={timelineElements[currentSection]} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {currentSection > 0 && (
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => navigateSection(currentSection - 1)} 
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-primary hover:text-accent transition-colors"
        >
          <i className="fa-solid fa-chevron-left text-4xl" />
        </motion.button>
      )}
      {currentSection < timelineElements.length - 1 && (
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => navigateSection(currentSection + 1)} 
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-primary hover:text-accent transition-colors"
        >
          <i className="fa-solid fa-chevron-right text-4xl" />
        </motion.button>
      )}
    </div>
  );
};

const ProfileSection = ({ element }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-8 overflow-y-auto"
    >
      <h2 className="text-4xl font-bold text-primary mb-6">My Developer Profile</h2>
      <div className="max-w-3xl text-lg space-y-8">
        <Section title="About Me" content={element.aboutMe} />
        <Section title="Hobbies" content={element.hobbies} />
        <Section title="Interests" content={element.interests} />
      </div>
    </motion.div>
  );
};

const Section = ({ title, content }) => (
  <div>
    <h3 className="text-2xl font-semibold text-primary mb-2">{title}</h3>
    <p className="text-text">{content}</p>
  </div>
);

const FuturePlansSection = ({ element }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary/20 to-accent/20 p-8"
    >
      <h2 className="text-4xl font-bold text-primary mb-6">Future Plans</h2>
      <div className="max-w-3xl text-lg space-y-4">
        <p>{element.longDescription}</p>
      </div>
    </motion.div>
  );
};

const TimelineEventSection = ({ element, calculateAge }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const backgroundColors = [
    'from-primary/20 to-secondary/20',
    'from-secondary/20 to-accent/20',
    'from-accent/20 to-highlight/20',
    'from-highlight/20 to-darkblue/20',
    'from-darkblue/20 to-darkpurple/20',
    'from-darkpurple/20 to-darkgreen/20',
    'from-darkgreen/20 to-muted/20',
    'from-muted/20 to-primary/20',
  ];

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${backgroundColors[element.order % backgroundColors.length]} p-8`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center justify-center"
      >
        <div className="text-6xl mb-4">
          <i className={element.icon} />
        </div>
        <h2 className="text-5xl font-bold text-primary mb-4">{element.year}</h2>
        <h3 className="text-3xl font-semibold mb-4">{element.title}</h3>
        <p className="text-xl mb-6 max-w-2xl">{element.shortDescription}</p>
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : '0' }}
          className="overflow-hidden"
        >
          <p className="text-lg mb-4 max-w-3xl">{element.longDescription}</p>
          <div className="flex items-center justify-center text-accent">
            <i className="fa-solid fa-child-reaching mr-2" />
            <span>Age: {calculateAge(element.year)}</span>
          </div>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-primary hover:text-accent transition-colors"
        >
          <i className={isExpanded ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"} size="2x" />
        </motion.button>
      </motion.div>
    </div>
  );
};

const CurrentSection = ({ element }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-darkblue/20 to-darkpurple/20 p-8"
    >
      <h2 className="text-4xl font-bold text-primary mb-6">Current</h2>
      <div className="max-w-3xl text-lg space-y-4">
        <p>{element.longDescription}</p>
      </div>
    </motion.div>
  );
};

export default About;