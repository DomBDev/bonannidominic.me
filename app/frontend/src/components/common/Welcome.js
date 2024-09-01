import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const interests = [
  { name: "Machine Learning", description: "Exploring algorithms for intelligent systems.", icon: "fas fa-robot" },
  { name: "Web Development", description: "Creating interactive and dynamic web applications.", icon: "fas fa-globe" },
  { name: "Internet of Things (IoT)", description: "Connecting devices for enhanced functionality.", icon: "fas fa-plug" },
  { name: "3D Printing", description: "Bringing digital models into the physical world.", icon: "fas fa-cube" },
  { name: "Engineering", description: "Applying scientific principles to solve real-world problems.", icon: "fas fa-tools" },
];

const skills = [
  { name: 'Python', iconClass: 'fab fa-python text-yellow-500' },
  { name: 'JavaScript', iconClass: 'fab fa-js text-yellow-500' },
  { name: 'HTML', iconClass: 'fab fa-html5 text-orange-500' },
  { name: 'CSS', iconClass: 'fab fa-css3-alt text-blue-500' },
  { name: 'SQL', iconClass: 'fas fa-database text-green-500' },
  { name: 'MongoDB', iconClass: 'fas fa-database text-green-500' },
  { name: 'React', iconClass: 'fab fa-react text-blue-500' },
  { name: 'Node.js', iconClass: 'fab fa-node-js text-green-500' },
  { name: 'Express', iconClass: 'fab fa-node-js text-green-500' },
  { name: 'Flask', iconClass: 'fas fa-flask text-gray-500' },
  { name: 'Django', iconClass: 'fab fa-django text-blue-500' },
  { name: 'Tailwind CSS', iconClass: 'fab fa-css3-alt text-teal-500' },
  { name: 'Bootstrap', iconClass: 'fab fa-bootstrap text-purple-500' },
  { name: 'Git', iconClass: 'fab fa-git text-orange-500' },
  { name: 'GitHub', iconClass: 'fab fa-github text-black' },
  { name: 'Digital Ocean', iconClass: 'fas fa-cloud text-blue-500' },
  { name: 'Heroku', iconClass: 'fas fa-cloud text-purple-500' },
  { name: 'VS Code', iconClass: 'fas fa-code text-blue-500' },
  { name: 'Ubuntu', iconClass: 'fab fa-ubuntu text-orange-500' },
  { name: 'Debian', iconClass: 'fab fa-debian text-red-500' },
  { name: 'Arduino', iconClass: 'fab fa-arduino text-blue-500' },
  { name: 'Raspberry Pi', iconClass: 'fab fa-raspberry-pi text-red-500' },
  { name: 'Fusion 360', iconClass: 'fas fa-cube text-blue-500' },
  { name: 'ESP32', iconClass: 'fab fa-usb text-blue-500' },
];

// TODO: Make looping infinite.
const SkillsMarquee = () => (
  <div className="skills-marquee-container flex flex-row overflow-hidden whitespace-nowrap py-2 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl rounded-lg border-2 border-primary">
    <div className="marquee1 skills-marquee flex animate-marquee">
      {skills.map((skill, index) => (
        <motion.div
          key={index}
          className="skill-item flex items-center mx-4"
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <i className={`${skill.iconClass} text-2xl mr-2`}></i>
          {skill.name}
        </motion.div>
      ))}
    </div>
    <div className="marquee2 skills-marquee flex animate-marquee">
      {skills.map((skill, index) => (
        <motion.div
          key={index}
          className="skill-item flex items-center mx-4"
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.5, delay: index * 0.1 + (0.1*skills.length) }}
        >
          <i className={`${skill.iconClass} text-2xl mr-2`}></i>
          {skill.name}
        </motion.div>
      ))}
    </div>
  </div>
);

const ProfileCard = () => {
  const calculateYearsOfExperience = () => {
    const startDate = new Date(2020, 2); // March 2020 (month is 0-indexed)
    const currentDate = new Date();
    const years = currentDate.getFullYear() - startDate.getFullYear();
    const months = currentDate.getMonth() - startDate.getMonth();
    const totalYears = years + (months / 12);
    return parseFloat(totalYears.toFixed(1));
  };
  
  const [viewCount, setViewCount] = useState(1000);
  const [completedProjectsCount, setCompletedProjectsCount] = useState(7);
  const [yearsOfExperience, setYearsOfExperience] = useState(calculateYearsOfExperience());
  
  // Function to animate the count up
  const animateCount = (endValue, setValue, isDecimal = false) => {
    let startValue = 0;
    const duration = 2000; // 2 seconds
    const increment = endValue / (duration / 10);
  
    const interval = setInterval(() => {
      startValue += increment;
      if (startValue >= endValue) {
        startValue = endValue;
        clearInterval(interval);
      }
      setValue(isDecimal ? parseFloat(startValue.toFixed(1)) : Math.floor(startValue));
    }, 10);
  };
  
  useEffect(() => {
    animateCount(viewCount, setViewCount); // Example end value for views
    animateCount(completedProjectsCount, setCompletedProjectsCount); // Example end value for completed projects
    animateCount(calculateYearsOfExperience(), setYearsOfExperience, true); // Calculate years of experience dynamically
  }, []);

  return (
    <motion.div 
      className="bg-gradient-to-tr from-[#152414] via-[#1b1424] to-[#201f2b] rounded-lg shadow-xl p-6 max-w-md transition"
      whileHover={{ boxShadow: "0 0 12px #00ffcc" }}
      transition={{ duration: 1 }}
    >
      <div className="flex items-center justify-center mb-4">
        <img
          className="w-32 h-32 rounded-full shadow-lg border-4 border-primary"
          src="https://via.placeholder.com/150"
          alt="Profile"
        />
      </div>
      <h2 className="text-xl text-center text-white font-bold mb-2">Your Name</h2>
      <p className="text-gray-300 mb-4 text-center">
        Passionate about building innovative solutions and exploring new technologies.
      </p>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-black rounded-lg shadow-lg p-3 text-center transform transition hover:bg-primary duration-300 group relative">
          <h3 className="text-lg text-white font-semibold">Portfolio Views</h3>
          <p className="text-2xl text-green-400 group-hover:text-black transition duration-300 font-bold">{viewCount}</p>
          <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Represents the total number of views on my portfolio, showcasing interest and engagement.
          </div>
        </div>
        <div className="bg-black rounded-lg shadow-lg p-3 text-center transform transition hover:bg-primary duration-300 group relative">
          <h3 className="text-lg text-white font-semibold">Completed Projects</h3>
          <p className="text-2xl text-yellow-400 group-hover:text-black transition duration-300 font-bold">{completedProjectsCount}</p>
          <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Indicates the number of personal projects successfully completed, reflecting hands-on experience and dedication.
          </div>
        </div>
        <div className="bg-black rounded-lg shadow-lg p-3 text-center transform transition hover:bg-primary duration-300 group relative">
          <h3 className="text-lg text-white font-semibold">Years of Experience</h3>
          <p className="text-2xl text-blue-400 group-hover:text-black transition duration-300 font-bold">{yearsOfExperience}</p>
          <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Years of experience reflect my commitment to learning and self-development in the field, rather than formal employment history.
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-highlight transition duration-300 transform hover:scale-125">
          <i className="fab fa-github text-2xl"></i>
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-highlight transition duration-300 transform hover:scale-125">
          <i className="fab fa-linkedin text-2xl"></i>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-highlight transition duration-300 transform hover:scale-125">
          <i className="fab fa-twitter text-2xl"></i>
        </a>
      </div>
    </motion.div>
  );
};

const Interests = () => { 
  return (
    <motion.div 
      className="bg-gradient-to-tl from-[#142414] to-[#241424] rounded-md shadow-lg p-6 max-w-5xl mx-auto mt-8"
      whileInView={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-3xl font-bold text-primary mb-4">Interests</h2>
      <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 ml-4">
        {interests.map((interest, index) => (
          <motion.li 
            key={index} 
            className={`bg-background p-4 rounded-md shadow-md ${index % 2 === 0 ? 'hover:bg-darkpurple' : 'hover:bg-darkblue' } transition duration-300`}
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <i className={`${interest.icon} text-4xl text-primary mb-2`} />
            <h3 className="text-xl font-semibold">{interest.name}</h3>
            <p className="text-text mt-2">{interest.description}</p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const Welcome = () => {
  return (
    <section id="welcome" className="min-h-screen flex flex-col bg-gradient-to-br from-[#151515] via-[#181424] to-[#011024] relative w-full h-full sm:px-16 md:px-32 lg:px-48">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary to-secondary opacity-30 mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent to-background opacity-40 blur-lg" />
      </div>

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Upper Div */}
        <div className="flex flex-col flex-grow 2xl:flex-row gap-4">
          {/* Left Section */}
          <div className="flex-1 flex flex-col items-start justify-center px-6 pt-24">
            <motion.div 
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold text-primary drop-shadow-lg">
                Hello, I'm Dominic.
              </h1>
              <p className="mt-4 text-2xl md:text-3xl text-text max-w-xl drop-shadow-lg pl-1">
                Full Stack Web Developer - Tech Enthusiast
              </p>
            </motion.div>
            <div className="mt-8 flex flex-col ml-4">
              <SkillsMarquee />

              <a 
                className="bg-gradient-to-r from-primary to-highlight mt-2 px-4 py-2 w-fit rounded-sm text-background text-lg md:text-xl font-bold cursor-pointer" 
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              >
                Want to work together?
              </a>
            </div>
          </div>
          {/* Right Section */}
          <div className="flex-1 flex items-center justify-start 2xl:justify-center px-6 mt-16 2xl:mr-4">
            <ProfileCard />
          </div>
        </div>
        {/* Lower Div */}
        <div className="flex flex-grow items-center justify-evenly">
          <div className='flex-1'>
          </div>
          <Interests /> {/* Add the Interests component here */}
        </div>
      </div>
    </section>
  );
};

export default Welcome;