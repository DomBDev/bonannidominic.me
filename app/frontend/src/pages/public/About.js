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
            className="w-full h-full absolute px-4 sm:px-8 md:px-0"
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
          className="absolute left-2 sm:left-8 top-1/2 transform -translate-y-1/2 text-primary hover:text-accent transition-colors"
        >
          <i className="fa-solid fa-chevron-left text-2xl sm:text-4xl" />
        </motion.button>
      )}
      {currentSection < timelineElements.length - 1 && (
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => navigateSection(currentSection + 1)} 
          className="absolute right-2 sm:right-8 top-1/2 transform -translate-y-1/2 text-primary hover:text-accent transition-colors"
        >
          <i className="fa-solid fa-chevron-right text-2xl sm:text-4xl" />
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
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4 sm:p-8 overflow-y-auto mt-16 sm:mt-20"
    >
      <AnimatedPath type="profile" />
      <AnimatedProfileSVG />
      <h2 className="text-2xl sm:text-4xl font-bold text-primary mb-2">My Developer Profile</h2>
      <div className="max-w-3xl text-sm sm:text-md space-y-4">
        {element.profile && Object.entries(element.profile).map(([title, content], index) => (
          <Section key={index} title={title} content={content} />
        ))}
      </div>
    </motion.div>
  );
};

const Section = ({ title, content }) => (
  <div>
    <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
    <p className="text-text">{content}</p>
  </div>
);

const FuturePlansSection = ({ element }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary/20 to-accent/20 p-4 sm:p-8 relative overflow-hidden pt-16 sm:pt-20"
    >
      <AnimatedPath type="future" />
      <AnimatedFutureSVG />
      <h2 className="text-2xl sm:text-4xl font-bold text-primary mb-4 sm:mb-6">Future Plans</h2>
      <div className="max-w-3xl text-sm sm:text-md space-y-4 relative z-10">
        <motion.div
          transition={{ duration: 0.5 }}
          className="overflow-hidden"
        >
          {element.future && Object.entries(element.future).map(([title, content], index) => (
            <PlanSection key={index} title={title} content={content} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const PlanSection = ({ title, content }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-4"
  >
    <h3 className="text-2xl font-semibold text-primary mb-2">{title}</h3>
    <p className="text-text">{content}</p>
  </motion.div>
);

const AnimatedPath = ({ type }) => {
  const svgConfigs = {
    future: {
      className: "absolute top-0 left-0 w-full h-full",
      paths: [
        {
          d: "M0,50 Q150,0 300,50 T600,50",
          stroke: "rgba(255,255,255,0.1)",
          duration: 2,
          delay: 0,
        },
        {
          d: "M0,150 Q150,100 300,150 T600,150",
          stroke: "rgba(173,216,230,0.1)",
          duration: 2.5,
          delay: 0.5,
        },
      ],
    },
    timeline: {
      className: "absolute bottom-0 right-0 w-1/4 h-3/4",
      paths: [
        {
          d: "M450,0 Q300,75 150,0 T0,75",
          stroke: "rgba(255,192,203,0.1)",
          duration: 3,
          delay: 0,
        },
        {
          d: "M450,150 Q300,75 150,150 T0,75",
          stroke: "rgba(152,251,152,0.1)",
          duration: 2.7,
          delay: 0.3,
        },
      ],
    },
    current: {
      className: "absolute top-1/4 left-1/4 w-1/2 h-1/2",
      paths: [
        {
          d: "M0,0 C75,75 225,75 300,0",
          stroke: "rgba(255,165,0,0.1)",
          duration: 2.3,
          delay: 0,
        },
        {
          d: "M0,150 C75,75 225,225 300,150",
          stroke: "rgba(138,43,226,0.1)",
          duration: 2.8,
          delay: 0.2,
        },
      ],
    },
    profile: {
      className: "absolute top-0 right-0 w-1/2 h-full",
      paths: [
        {
          d: "M150,0 C75,75 225,225 150,300",
          stroke: "rgba(255,105,180,0.1)",
          duration: 2.1,
          delay: 0,
        },
        {
          d: "M0,150 C75,75 225,225 300,150",
          stroke: "rgba(64,224,208,0.1)",
          duration: 2.6,
          delay: 0.4,
        },
      ],
    },
  };

  const selectedConfig = svgConfigs[type] || svgConfigs.future;

  return (
    <svg className={selectedConfig.className} xmlns="http://www.w3.org/2000/svg">
      {selectedConfig.paths.map((path, index) => (
        <motion.path
          key={index}
          d={path.d}
          fill="none"
          stroke={path.stroke}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { 
              duration: path.duration, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut",
            },
            opacity: { duration: 1, delay: path.delay },
          }}
        />
      ))}
    </svg>
  );
};

const AnimatedFutureSVG = () => (
  <svg
    className="w-32 h-32 text-primary/50"
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <motion.rect
        height="8"
        width="8"
        x="92"
        y="28"
        stroke="currentColor"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.rect
        height="8"
        width="8"
        x="28"
        y="16"
        stroke="currentColor"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
      />
      <motion.rect
        height="8"
        width="8"
        x="44"
        y="40"
        stroke="currentColor"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
      />
      <motion.path
        d="M112,40v35.2c-3.3-2.3-7.3-4.2-12-5.8V44h-8v23.1C83.3,65,73.6,64,64,64c-4,0-8,0.2-12,0.5V56h-8v9.5
        c-2.7,0.4-5.4,1-8,1.6V32h-8v37.4c-4.7,1.6-8.7,3.5-12,5.8V56H8v32c0,15.6,28.9,24,56,24s56-8.4,56-24V40H112z M16,88
        c0-5,10.3-11.5,28-14.4v28.9C26.3,99.5,16,93,16,88z M88,101.7V80h-8v23c-4.9,0.6-10.2,1-16,1c-4.2,0-8.2-0.2-12-0.5V72.5
        c3.8-0.3,7.8-0.5,12-0.5c29.7,0,48,9.3,48,16C112,92.6,103.2,98.5,88,101.7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 3, ease: "easeInOut" },
          opacity: { duration: 0.5 }
        }}
      />
    </g>
  </svg>
);

const AnimatedProfileSVG = () => (
  <svg
    className="w-32 h-32 text-blue-500/20"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <motion.path
        d="M43,42H5c-2.209,0-4-1.791-4-4V17c0-2.209,1.791-4,4-4h15V9c0-2.209,1.791-4,4-4s4,1.791,4,4v4h15c2.209,0,4,1.791,4,4v21C47,40.209,45.209,42,43,42z M17.014,34.488c0,0.003,0,0.004,0,0.004c-0.004,0-0.018-0.781-0.018-0.781s1.166-0.601,2.031-1.378c0.507-0.417,0.741-1.362,0.741-1.362c0.137-0.828,0.238-2.877,0.238-3.703c0-2.062-1.033-4.28-4.007-4.28V22.98v0.007c-2.974,0-4.007,2.219-4.007,4.28c0,0.826,0.102,2.875,0.238,3.703c0,0,0.234,0.945,0.741,1.362c0.865,0.777,2.031,1.378,2.031,1.378s-0.014,0.781-0.018,0.781c0,0,0-0.001,0-0.004c0,0,0.029,1.146,0.029,1.487c0,1.362-1.365,2.018-2.223,2.018c-0.002,0-0.002,0-0.003,0c-2.593,0.113-3.205,0.976-3.21,0.984C9.419,39.23,9.199,39.482,8.998,40h14.004c-0.201-0.518-0.421-0.77-0.582-1.022c-0.005-0.009-0.617-0.871-3.21-0.984c-0.001,0-0.001,0-0.003,0c-0.857,0-2.223-0.655-2.223-2.018C16.984,35.634,17.014,34.488,17.014,34.488z M26,9c0-1.104-0.896-2-2-2s-2,0.896-2,2v6c0,1.104,0.896,2,2,2s2-0.896,2-2V9z M45,17c0-1.104-0.896-2-2-2H28c0,2.209-1.791,4-4,4s-4-1.791-4-4H5c-1.104,0-2,0.896-2,2v21c0,1.104,0.896,2,2,2h1.797c0.231-0.589,0.656-1.549,1.16-2.24c0.025-0.014,0.848-1.739,4.998-1.79c0.006-0.021,0.01-1.042,0.022-1.027c-0.32-0.202-0.737-0.516-1.051-0.816c-0.255-0.156-1.161-1.029-1.452-2.583c-0.087-0.542-0.488-3.099-0.488-4.166c0-3.171,1.265-6.381,5.953-6.381c0.021,0,0.1,0,0.121,0c4.688,0,5.953,3.21,5.953,6.381c0,1.067-0.401,3.624-0.488,4.166c-0.291,1.554-1.197,2.427-1.452,2.583c-0.313,0.301-0.73,0.614-1.051,0.816c0.013-0.015,0.017,1.007,0.022,1.027c4.151,0.051,4.974,1.776,4.998,1.79c0.504,0.691,0.929,1.651,1.16,2.24H43c1.104,0,2-0.896,2-2V17z M40,26H28c-0.553,0-1-0.447-1-1s0.447-1,1-1h12c0.553,0,1,0.447,1,1S40.553,26,40,26z M28,30h2c0.553,0,1,0.447,1,1s-0.447,1-1,1h-2c-0.553,0-1-0.447-1-1S27.447,30,28,30z M28,34h6c0.553,0,1,0.447,1,1s-0.447,1-1,1h-6c-0.553,0-1-0.447-1-1S27.447,34,28,34z M32,31c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1s-0.447,1-1,1h-4C32.447,32,32,31.553,32,31z M23,9h2v2h-2V9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 3, ease: "easeInOut" },
          opacity: { duration: 0.5 }
        }}
      />
    </g>
  </svg>
);

const AnimatedCurrentSVG = () => (
  <svg
    className="w-32 h-32 text-primary/20"
    style={{ enableBackground: 'new 0 0 100.4 100.4' }}
    version="1.1"
    viewBox="0 0 100.4 100.4"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <motion.path
        d="M92.9,60.4l-7.4-5v-15l7.4-4.9c0.4-0.3,0.7-0.7,0.7-1.2c0-0.5-0.3-1-0.7-1.2L54.8,7.5c-0.5-0.3-1.2-0.3-1.7,0L6.1,38.9   c-0.2,0.1-0.3,0.2-0.4,0.4c0,0,0,0,0,0.1c-0.2,0.3-0.2,0.5-0.2,0.8v27.5c0,0.5,0.3,1,0.7,1.2l38.1,25.4c0.3,0.2,0.5,0.3,0.8,0.3   c0.3,0,0.6-0.1,0.8-0.3l47.1-31.4c0.4-0.3,0.7-0.7,0.7-1.2C93.6,61.1,93.3,60.6,92.9,60.4z M54,10.6l35.4,23.6L83.6,38   c-0.3,0.1-0.6,0.3-0.8,0.5L45,63.7L16.6,44.8c-0.1-0.1-0.2-0.1-0.2-0.2l-6.8-4.5L54,10.6z M17.1,48.8l27,18c0.5,0.3,1.2,0.3,1.7,0   l36.7-24.5v12.3L45.2,79.2l-28.1-18L17.1,48.8L17.1,48.8z M45,91.2L8.4,66.8V43l5.8,3.8V62c0,0.5,0.3,1,0.7,1.3l29.6,19   c0.2,0.2,0.5,0.2,0.8,0.2c0.3,0,0.6-0.1,0.8-0.2l37.4-24.6l5.9,4L45,91.2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 3, ease: "easeInOut" },
          opacity: { duration: 0.5 }
        }}
      />
      <motion.path
        d="M47.5,24.3l17.8,12.2c0.3,0.2,0.6,0.3,0.8,0.3c0.5,0,0.9-0.2,1.2-0.7c0.5-0.7,0.3-1.6-0.4-2.1L49.2,21.8   c-0.7-0.5-1.6-0.3-2.1,0.4C46.6,22.9,46.8,23.8,47.5,24.3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 3, ease: "easeInOut" },
          opacity: { duration: 0.5 }
        }}
      />
    </g>
  </svg>
);

const TimelineSVG = () => (
  <svg
    className="w-32 h-32 text-primary/20 mb-2"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(-2048,-1024)">
      <motion.path
        d="m 2304,1232.49 c -11.502,0 -20.86,-9.357 -20.86,-20.86 0,-11.507 9.358,-20.87 20.86,-20.87 11.508,0 20.87,9.363 20.87,20.87 0,11.503 -9.362,20.86 -20.87,20.86 M 2304,1369.25 c -11.502,0 -20.86,-9.363 -20.86,-20.87 C 2283.14,1336.863 2292.498,1327.5 2304,1327.5 c 11.508,0 20.87,9.363 20.87,20.87 0,11.507 -9.362,20.87 -20.87,20.87 m 0,136.75 c -11.502,0 -20.86,-9.358 -20.86,-20.86 0,-11.507 9.358,-20.871 20.86,-20.871 11.508,0 20.87,9.364 20.87,20.871 0,11.502 -9.362,20.86 -20.87,20.86 m 0,-452 c 11.508,0 20.87,9.362 20.87,20.87 0,11.508 -9.362,20.87 -20.87,20.87 -11.502,0 -20.86,-9.362 -20.86,-20.87 0,-11.508 9.358,-20.87 20.86,-20.87 m 50.87,20.87 c 0,-28.05 -22.82,-50.87 -50.87,-50.87 -28.044,0 -50.86,22.82 -50.86,50.87 0,22.829 15.114,42.192 35.86,48.61 v 39.54 c -20.746,6.417 -35.86,25.781 -35.86,48.61 0,22.825 15.114,42.184 35.86,48.6 v 39.54 c -20.746,6.417 -35.86,25.781 -35.86,48.61 0,22.829 15.114,42.192 35.86,48.61 v 39.54 c -20.746,6.417 -35.86,25.78 -35.86,48.61 0,28.044 22.816,50.86 50.86,50.86 28.05,0 50.87,-22.816 50.87,-50.86 0,-22.831 -15.119,-42.195 -35.87,-48.611 V 1397.48 C 2339.751,1391.064 2354.87,1371.701 2354.87,1348.87 2354.87,1326.039 2339.751,1306.675 2319,1300.259 v -39.538 c 20.751,-6.415 35.87,-25.775 35.87,-48.601 0,-22.831 -15.119,-42.195 -35.87,-48.611 v -39.539 c 20.751,-6.416 35.87,-25.779 35.87,-48.61"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 3, ease: "easeInOut" },
          opacity: { duration: 0.5 }
        }}
      />
      <motion.path
        d="m 2188.22,1085.476 c -2.836,2.836 -6.605,4.397 -10.614,4.397 h -79.18 c -4.008,0 -7.77,-1.557 -10.613,-4.405 -2.829,-2.824 -4.387,-6.588 -4.387,-10.595 0,-4.006 1.558,-7.77 4.405,-10.612 2.825,-2.83 6.587,-4.388 10.595,-4.388 h 79.18 c 4.009,0 7.778,1.562 10.613,4.396 2.788,2.789 4.387,6.654 4.387,10.604 0,3.951 -1.599,7.816 -4.386,10.603 m -10.614,-55.603 h -79.18 c -12.031,0 -23.333,4.685 -31.808,13.175 -8.507,8.492 -13.192,19.795 -13.192,31.825 0,12.031 4.685,23.333 13.174,31.808 8.493,8.508 19.795,13.192 31.826,13.192 h 79.18 c 12.021,0 23.324,-4.681 31.827,-13.184 8.495,-8.494 13.173,-19.794 13.173,-31.816 0,-12.021 -4.678,-23.321 -13.174,-31.817 -8.502,-8.501 -19.805,-13.183 -31.826,-13.183"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 3.5, ease: "easeOut", delay: 0.5 },
          opacity: { duration: 0.5 }
        }}
      />
      <motion.path
        d="m 2188.22,1358.988 c -2.835,2.835 -6.605,4.396 -10.614,4.396 h -79.18 c -4.008,0 -7.77,-1.557 -10.613,-4.405 -2.829,-2.824 -4.387,-6.587 -4.387,-10.595 0,-4.006 1.558,-7.77 4.405,-10.612 2.825,-2.83 6.587,-4.388 10.595,-4.388 h 79.18 c 4.009,0 7.778,1.562 10.613,4.396 2.788,2.789 4.387,6.654 4.387,10.604 0,4.009 -1.558,7.776 -4.386,10.604 m -10.614,-55.604 h -79.18 c -12.031,0 -23.333,4.685 -31.808,13.175 -8.507,8.492 -13.192,19.795 -13.192,31.825 0,12.031 4.685,23.333 13.174,31.808 8.492,8.508 19.795,13.192 31.826,13.192 h 79.18 c 12.022,0 23.324,-4.681 31.827,-13.183 8.495,-8.495 13.173,-19.794 13.173,-31.817 0,-12.021 -4.678,-23.321 -13.174,-31.817 -8.502,-8.501 -19.805,-13.183 -31.826,-13.183"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 2, ease: "easeOut", delay: 1.5 },
          opacity: { duration: 0.5 }
        }}
      />
      <motion.path
        d="m 2419.77,1201.022 c 2.799,-2.793 6.667,-4.396 10.612,-4.396 h 79.191 c 4.009,0 7.774,1.558 10.603,4.387 2.835,2.835 4.397,6.605 4.397,10.613 0,4.003 -1.562,7.769 -4.397,10.604 -2.794,2.794 -6.659,4.396 -10.603,4.396 h -79.191 c -3.939,0 -7.807,-1.606 -10.593,-4.386 -2.8,-2.806 -4.407,-6.674 -4.407,-10.614 0,-4.003 1.565,-7.776 4.388,-10.604 m 10.612,55.604 h 79.191 c 12.015,0 23.314,-4.681 31.817,-13.183 8.501,-8.502 13.183,-19.802 13.183,-31.817 0,-12.022 -4.682,-23.325 -13.184,-31.826 -8.495,-8.495 -19.794,-13.174 -31.816,-13.174 h -79.191 c -12.007,0 -23.303,4.675 -31.826,13.183 -8.495,8.511 -13.174,19.811 -13.174,31.817 0,12.001 4.679,23.297 13.194,31.828 8.509,8.494 19.805,13.172 31.806,13.172"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 1.5, ease: "easeOut", delay: 1 },
          opacity: { duration: 0.5 }
        }}
      />
      <motion.path
        d="m 2520.18,1495.748 c -2.794,2.793 -6.659,4.396 -10.604,4.396 h -79.19 c -3.939,0 -7.808,-1.606 -10.594,-4.387 -2.8,-2.806 -4.406,-6.673 -4.406,-10.613 0,-4.003 1.565,-7.777 4.387,-10.604 2.799,-2.794 6.667,-4.396 10.613,-4.396 h 79.19 c 3.952,0 7.816,1.599 10.603,4.385 2.836,2.836 4.397,6.606 4.397,10.615 0,4.002 -1.561,7.768 -4.396,10.604 m -10.604,-55.604 h -79.19 c -12.007,0 -23.303,4.674 -31.826,13.182 -8.495,8.512 -13.174,19.811 -13.174,31.818 0,12 4.679,23.297 13.192,31.826 8.511,8.495 19.807,13.174 31.808,13.174 h 79.19 c 12.016,0 23.316,-4.682 31.817,-13.183 8.502,-8.502 13.183,-19.801 13.183,-31.817 0,-12.021 -4.681,-23.324 -13.183,-31.828 -8.495,-8.494 -19.795,-13.172 -31.817,-13.172"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 1, ease: "easeOut", delay: 2 },
          opacity: { duration: 0.5 }
        }}
      />
    </g>
  </svg>
);

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
        <AnimatedPath type="timeline" />
        <TimelineSVG />
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
      <AnimatedPath type="current" />
      <AnimatedCurrentSVG />
      <h2 className="text-4xl font-bold text-primary mb-6">Current</h2>
      <div className="max-w-3xl text-lg space-y-4">
        <p>{element.longDescription}</p>
      </div>
    </motion.div>
  );
};

export default About;