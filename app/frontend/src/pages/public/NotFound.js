import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaHome } from 'react-icons/fa';
import githubLogo from '../../assets/github.png'

const NotFound = () => {
  const githubPath = "M 13.072 19.782 C 16.498 19.011 24.347 11.952 17.352 3.436 A 1 1 0 0 0 2.885 17.282 C 3.566 18.087 5.148 19.358 6.869 19.759 A 1 1 0 0 0 7.347 19.683 A 1 1 0 0 0 7.519 19.401 V 17.386 C 3.63 17.979 4.716 15.876 2.876 14.607 C 2.849 14.57 2.472 14.286 2.818 14.163 C 3.24 14.051 4.193 14.35 4.643 15.187 C 4.869 15.516 5.176 15.994 5.909 16.243 C 6.592 16.286 6.981 16.253 7.521 16.028 C 7.553 15.953 7.588 15.189 8.175 14.666 C 7.732 14.398 3.229 14.81 3.709 8.843 C 3.763 8.525 3.936 7.838 4.658 7.043 C 4.57 6.91 4.169 5.822 4.755 4.401 C 5.303 4.25 6.724 4.844 7.496 5.434 C 8.719 5.099 10.598 4.823 12.484 5.429 C 13.026 5.125 14.303 4.181 15.226 4.431 C 15.421 4.653 15.816 6.18 15.323 7.062 C 16.877 8.128 17.493 14.273 11.84 14.657 C 12.927 15.783 12.366 17.912 12.501 19.398 C 12.642 19.841 12.955 19.771 13.072 19.782 Z C 13.414 19.704 16.56 18.891 19.009 14.739";

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      stroke: [
        "#ebe2e1", // text
        "#6dabca", // primary
        "#4b3f72", // secondary
        "#3b945e", // accent
        "#8e7cc3", // highlight
        "#ebe2e1"  // text (to loop back to the start)
      ],
      transition: {
        pathLength: { type: "spring", duration: 10, bounce: 0.2 },
        opacity: { duration: 3 },
        stroke: { duration: 10, repeat: Infinity }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkblue via-muted to-darkpurple flex flex-col items-center justify-center px-4">
      <motion.h1
        className="text-6xl font-bold text-primary text-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        404 - Page Not Found
      </motion.h1>
      <motion.p
        className="text-xl text-text text-center mb-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Unable to find the page you're looking for.
      </motion.p>
      <div className="relative w-64 h-64 cursor-pointer mb-8 group">
        <motion.div
          className="absolute inset-0 flex"
          onClick={() => window.open('https://github.com/DomBDev', '_blank')}
        >
          <img src={githubLogo} alt="GitHub Logo" className="absolute inset-0 w-full h-full p-3 group-hover:opacity-50 group-hover:-translate-y-5 transition-all duration-300" />
        </motion.div>
        <svg className="absolute inset-0 w-full h-full flex items-center justify-center group-hover:-translate-y-5 transition-all duration-300" viewBox="-1 -1 22 22" onClick={() => window.open('https://github.com/DomBDev', '_blank')}>
          <motion.path
            d={githubPath}
            fill="none"
            stroke="#4b3f72"
            strokeWidth="0.5"
            variants={pathVariants}
            initial="hidden"
            animate={["visible"]}
            onClick={() => window.open('https://github.com/DomBDev', '_blank')}
          />
        </svg>
      </div>
      <div className="flex space-x-4">
        <Link
          to="/"
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition duration-300 flex items-center"
        >
          <FaHome className="mr-2" /> Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;