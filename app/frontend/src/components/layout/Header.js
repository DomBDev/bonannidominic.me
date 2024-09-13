import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleContactClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 w-full bg-gradient-to-t from-background via-background/60 to-background/30 backdrop-blur-lg z-50 shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        <motion.a
          className="text-primary text-2xl font-bold cursor-pointer"
          href="/"
        >
          Dominic Bonanni
        </motion.a>
        <div className="hidden md:flex items-center space-x-8">
          <motion.a
            whileHover={{ color: '#6dabca' }}
            transition={{ duration: 0.1 }}
            href="/"
            className="text-text transition duration-100 flex items-center"
          >
            Home {isActive('/') && <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>}
          </motion.a>
          <motion.a
            whileHover={{ color: '#6dabca' }}
            transition={{ duration: 0.1 }}
            href="/projects"
            className="text-text transition duration-100 flex items-center"
          >
            Projects {isActive('/projects') && <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>}
          </motion.a>
          <motion.a
            whileHover={{ color: '#6dabca' }}
            transition={{ duration: 0.1 }}
            href="/about"
            className="text-text transition duration-100 flex items-center"
          >
            About {isActive('/about') && <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>}
          </motion.a>
          {isLoggedIn() && (
            <motion.a
              whileHover={{ color: '#6dabca' }}
              href="/admin/dashboard"
              className="text-text transition duration-100 flex items-center"
            >
              Dashboard
            </motion.a>
          )}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <button
              onClick={handleContactClick}
              className="relative z-10 text-white px-6 py-2 bg-gradient-to-tl from-secondary via-secondary to-primary rounded-full shadow-lg transform transition duration-300 ease-in-out"
            >
              Contact
            </button>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-tl from-secondary via-highlight to-primary rounded-full opacity-50"
            ></motion.div>
          </motion.div>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-text focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-background bg-opacity-90 backdrop-blur-lg absolute w-full py-4 space-y-4"
        >
          <motion.a
            whileHover={{ color: '#6dabca' }}
            href="/"
            className="block text-center text-text transition duration-300 flex justify-center items-center"
          >
            Home {isActive('/') && <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>}
          </motion.a>
          <motion.a
            whileHover={{ color: '#6dabca' }}
            href="/projects"
            className="block text-center text-text transition duration-300 flex justify-center items-center"
          >
            Projects {isActive('/projects') && <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>}
          </motion.a>
          <motion.a
            whileHover={{ color: '#6dabca' }}
            href="/about"
            className="block text-center text-text transition duration-300 flex justify-center items-center"
          >
            About {isActive('/about') && <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>}
          </motion.a>
          {isLoggedIn() && (
            <motion.a
              whileHover={{ color: '#6dabca' }}
              href="/admin/dashboard"
              className="block text-center text-text transition duration-300 flex justify-center items-center"
            >
              Dashboard
            </motion.a>
          )}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="block text-center"
          >
            <button
              onClick={handleContactClick}
              className="text-white px-6 py-2 bg-accent rounded-full shadow-lg transform transition duration-300 ease-in-out"
            >
              Contact
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;