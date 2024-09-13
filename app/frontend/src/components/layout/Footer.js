import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'; // Import icons from react-icons

const Footer = () => {
  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#151515] text-[#ebe2e1] p-4 flex justify-between items-center"
    >
      <div className="flex items-center space-x-4">
        <a href="https://twitter.com/yourprofile" className="text-[#6dabca] hover:text-[#ebe2e1]">
          <FaTwitter className="w-6 h-6" />
        </a>
        <a href="https://linkedin.com/in/yourprofile" className="text-[#6dabca] hover:text-[#ebe2e1]">
          <FaLinkedin className="w-6 h-6" />
        </a>
        <a href="https://github.com/yourprofile" className="text-[#6dabca] hover:text-[#ebe2e1]">
          <FaGithub className="w-6 h-6" />
        </a>
        {/* Add more social media icons as needed */}
      </div>
      <div className="text-sm px-4">
        <p>&copy; 2024 Dominic Bonanni All rights reserved.</p>
      </div>
      <div className="flex items-center space-x-4">
        <a href="#contact" className="text-[#6dabca] hover:text-[#ebe2e1]">
          Contact
        </a>
        <a href="#about" className="text-[#6dabca] hover:text-[#ebe2e1]">
          About
        </a>
      </div>
    </motion.footer>
  );
};

export default Footer;