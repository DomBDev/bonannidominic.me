import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const About = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  const fetchTimelineEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/timeline');
      setTimelineEvents(response.data);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
    }
  };

  const calculateAge = (year) => {
    const birthDate = new Date('2006-09-02');
    const timelineDate = new Date(year, 0, 1);
    const age = timelineDate.getFullYear() - birthDate.getFullYear();
    return `${age - 1}-${age}`;
  };

  const navigateSection = useCallback((newSection) => {
    if (newSection >= 0 && newSection < timelineEvents.length) {
      setDirection(newSection > currentSection ? 1 : -1);
      setCurrentSection(newSection);
    }
  }, [currentSection, timelineEvents.length]);

  const handleScroll = useCallback((event) => {
    event.preventDefault();
    if (event.deltaY > 0 && currentSection < timelineEvents.length - 1) {
      navigateSection(currentSection + 1);
    } else if (event.deltaY < 0 && currentSection > 0) {
      navigateSection(currentSection - 1);
    }
  }, [currentSection, navigateSection, timelineEvents.length]);

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        {timelineEvents.length > 0 && (
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
              x: { 
                type: "spring", 
                stiffness: 200, 
                damping: 25,
                mass: 1.2,
                velocity: 2
              },
              rotate: {
                type: "tween",
                duration: 0.5,
                ease: "anticipate"
              },
              scale: {
                type: "spring",
                stiffness: 300,
                damping: 10,
                restDelta: 0.001
              },
              opacity: { duration: 0.2 }
            }}
            className="w-full h-full absolute"
          >
            <TimelineSection 
              event={timelineEvents[currentSection]} 
              index={currentSection}
              calculateAge={calculateAge}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => navigateSection(currentSection - 1)} 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-accent transition-colors"
        disabled={currentSection === 0}
      >
        <i className="fa-solid fa-chevron-left text-4xl" />
      </button>
      <button 
        onClick={() => navigateSection(currentSection + 1)} 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-accent transition-colors"
        disabled={currentSection === timelineEvents.length - 1}
      >
        <i className="fa-solid fa-chevron-right text-4xl" />
      </button>
    </div>
  );
};

const TimelineSection = ({ event, index, calculateAge }) => {
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
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${backgroundColors[index % backgroundColors.length]} p-8`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center justify-center"
      >
        <div className="text-6xl mb-4">
          <i className={event.icon} />
        </div>
        <h2 className="text-5xl font-bold text-primary mb-4">{event.year}</h2>
        <h3 className="text-3xl font-semibold mb-4">{event.title}</h3>
        <p className="text-xl mb-6 max-w-2xl">{event.shortDescription}</p>
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : '0' }}
          className="overflow-hidden"
        >
          <p className="text-lg mb-4 max-w-3xl">{event.longDescription}</p>
          <div className="flex items-center justify-center text-accent">
            <i className="fa-solid fa-child-reaching mr-2" />
            <span>Age: {calculateAge(event.year)}</span>
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

export default About;