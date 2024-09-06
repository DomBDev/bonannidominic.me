import React from 'react';
import { motion } from 'framer-motion'; // For animations
import { Link } from 'react-scroll'; // For smooth scrolling

const ScrollNav = ({ sections, currentSection }) => {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      <nav className="fixed top-0 right-0 h-full flex flex-col items-start justify-start space-y-4 pt-24 pr-12 hidden lg:block z-10">
        {sections.map((section) => (
          <Link
            key={section}
            to={section}
            smooth={true}
            offset={-70}
            duration={500}
            className={`relative flex items-center justify-start cursor-pointer transition-transform ${
              currentSection === section ? 'scale-125' : ''
            }`}
          >
            {currentSection === section && (
              <motion.span
                layoutId="dot"
                className="absolute left-[-20px] w-2 h-2 rounded-full bg-[#6dabca]"
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            )}
            <span className="font-blocky">{section.charAt(0).toUpperCase() + section.slice(1)}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default ScrollNav;