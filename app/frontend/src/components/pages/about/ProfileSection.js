import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FaCode, FaGraduationCap, FaBriefcase, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { FaShuffle } from 'react-icons/fa6';
import axios from 'axios';

const ProfileSection = ({ element }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4 sm:p-8 overflow-y-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        <div className="lg:row-span-4">
          <ProfileCard />
        </div>
        <div className="lg:col-span-2 lg:row-span-2">
          <ContentSection element={element} />
        </div>
        <SocialLinks />
        <ContactCard />
        <RandomQuote />
        <SkillsShowcase />
      </div>
    </motion.div>
  );
};

const ProfileCard = () => {
    const [topSkills, setTopSkills] = useState([]);
  
    useEffect(() => {
      fetchTopSkills();
    }, []);
  
    const fetchTopSkills = async () => {
      try {
        const [skillsResponse, projectsResponse] = await Promise.all([
          axios.get('/api/skills'),
          axios.get('/api/projects')
        ]);
  
        const skills = skillsResponse.data;
        const projects = projectsResponse.data;
  
        // Calculate skill usage
        const skillUsage = skills.map(skill => {
          const usageCount = projects.filter(project => project.skills.includes(skill.name)).length;
          return { ...skill, usageCount };
        });
  
        // Sort skills by usage count and get top 4
        const sortedSkills = skillUsage.sort((a, b) => b.usageCount - a.usageCount);
        setTopSkills(sortedSkills.slice(0, 4));
      } catch (error) {
        console.error('Error fetching skills and projects:', error);
      }
    };

  return (
    <motion.div 
      className="bg-darkblue/20 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center shadow-lg h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.img 
        src="https://media.licdn.com/dms/image/v2/D4E03AQFTxWWGdxLxfQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1713118488934?e=1731542400&v=beta&t=LToIDy2y5F58TfUqCNM_PZSAWyg_rsaJYosdoG1pyYQ" 
        alt="Profile" 
        className="w-48 h-48 rounded-full mb-6 border-4 border-primary"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.h2 
        className="text-3xl font-bold text-primary mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Dominic Bonanni
      </motion.h2>
      <motion.p 
        className="text-xl text-accent mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Full Stack Developer
      </motion.p>
      
      <div className="w-full space-y-4">
        <InfoItem icon={<FaCode />} title="Top Skills">
          {topSkills.map((skill, index) => (
            <SkillBadge key={index}>{skill.name}</SkillBadge>
          ))}
        </InfoItem>

        <InfoItem icon={<FaGraduationCap />} title="Education">
          <p className="text-text">High School Diploma</p>
          <p className="text-sm text-text/80">Grove City Area High School, 2020 - 2024</p>
        </InfoItem>

        <InfoItem icon={<FaBriefcase />} title="Experience">
          <p className="text-text">Office Assistant and Tech Support at ImageFX Inc.</p>
          <p className="text-sm text-text/80">2021 - Present</p>
        </InfoItem>

        <InfoItem icon={<FaMapMarkerAlt />} title="Location">
          <p className="text-text">Grove City, PA</p>
        </InfoItem>
      </div>

      <motion.button
        className="mt-6 px-6 py-2 bg-primary text-background rounded-full font-semibold transition-all duration-300"
        whileHover={{ backgroundColor: "var(--color-accent)", color: "var(--color-background)" }}
        onClick={() => window.open('/WebResume.pdf', '_blank')}
      >
        Download Resume
      </motion.button>
    </motion.div>
  );
};

const InfoItem = ({ icon, title, children }) => (
  <motion.div 
  className="flex items-start space-x-3"
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.8 }}
  >
    <div className="text-accent text-xl mt-1">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <div className="mt-1">{children}</div>
    </div>
  </motion.div>
);

const SkillBadge = ({ children }) => (
  <motion.span 
    className="inline-block bg-accent/20 text-accent px-2 py-1 rounded-full text-sm mr-2 mb-2"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.8 }}
    whileHover={{ backgroundColor: "var(--color-accent)", color: "var(--color-background)" }}
  >
    {children}
  </motion.span>
);

const ContentSection = ({ element }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastInteraction, setLastInteraction] = useState(0);
    const contents = Object.entries(element.profile);
  
    useEffect(() => {
      const interval = setInterval(() => {
        const now = Date.now();
        if (now - lastInteraction > 20000 || lastInteraction === 0) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % contents.length);
        }
      }, 10000);
      return () => clearInterval(interval);
    }, [contents.length, lastInteraction]);
  
    const handleSlideChange = (index) => {
      setCurrentIndex(index);
      setLastInteraction(Date.now());
    };
  
    return (
        <div className="bg-darkpurple/20 backdrop-blur-sm rounded-xl p-8 shadow-lg flex flex-col h-full min-h-[400px] lg:min-h-[600px]">
          <h3 className="text-2xl font-semibold text-primary mb-4">About Me</h3>
          <div className="flex-grow overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="pr-2"
              >
                <h4 className="text-xl font-semibold text-accent mb-3">{contents[currentIndex][0]}</h4>
                <p className="text-text text-lg leading-relaxed">{contents[currentIndex][1]}</p>
              </motion.div>
            </AnimatePresence>
        </div>
        <div className="flex justify-center mt-4">
          {contents.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 cursor-pointer ${index === currentIndex ? 'bg-primary' : 'bg-gray-400'}`}
              whileHover={{ scale: 1.2 }}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
      </div>
    );
  };

  const SocialLinks = () => {
    const socialLinks = [
      { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', url: 'https://www.linkedin.com/in/bonanni-dominic' },
      { name: 'GitHub', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z', url: 'https://github.com/DomBDev' },
      { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', url: 'https://twitter.com/' },
    ];
  
    return (
      <motion.div 
        className="bg-darkgreen/20 backdrop-blur-sm rounded-xl p-6 shadow-lg h-full flex flex-col justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h3 className="text-2xl font-semibold text-primary mb-4">Connect with me</h3>
        <div className="flex justify-around">
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-primary transition-colors p-2 relative group"
            >
              <svg
                viewBox="-6 -6 36 36"
                className="w-20 h-20"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  <linearGradient id={`gradient-${link.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={link.name === 'GitHub' ? '#6e5494' : link.name === 'LinkedIn' ? '#0077B5' : '#1DA1F2'} />
                    <stop offset="100%" stopColor={link.name === 'GitHub' ? '#4078c0' : link.name === 'LinkedIn' ? '#00a0dc' : '#0084b4'} />
                  </linearGradient>
                </defs>
                {/* Background shape */}
                <rect x="-6" y="-6" width="36" height="36" rx="18" fill="var(--color-background)" />
                {/* Underlay icon */}
                <motion.path
                  d={link.icon}
                  className="group-hover:fill-primary fill-secondary group-hover:opacity-50 transition-all duration-300"
                />
                {/* Animated icon */}
                <motion.path
                  d={link.icon}
                  fill="none"
                  stroke={`url(#gradient-${link.name})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
              </svg>
            </motion.a>
          ))}
        </div>
      </motion.div>
    );
  };

  const ContactCard = () => {
    const handleContactClick = () => {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    };
  
    return (
      <motion.div
        className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm rounded-xl p-6 overflow-hidden relative shadow-lg h-full flex flex-col justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h3 className="text-2xl font-semibold text-primary mb-3">Let's Connect!</h3>
        <p className="text-text text-lg mb-4">Have a project in mind? Let's bring your ideas to life!</p>
        <motion.button
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-background rounded-full font-semibold transition-all duration-300"
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(var(--color-primary-rgb), 0.5)' }}
          onClick={handleContactClick}
        >
          <FaEnvelope className="mr-2" />
          Contact Me
        </motion.button>
      </motion.div>
    );
  };

const RandomQuote = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const controls = useAnimation();

  const quotes = [
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.", author: "Albert Schweitzer" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The only way to achieve the impossible is to believe it is possible.", author: "Charles Kingsleigh" },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "If you want to achieve greatness stop asking for permission.", author: "Anonymous" },
    { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
];

  const getRandomQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(newQuote.text);
    setAuthor(newQuote.author);
    controls.start({
      opacity: [0, 1],
      transition: { duration: 0.5 }
    });
    animateText(newQuote.text);
  };

  const animateText = async (text) => {
    await controls.start({ opacity: 0 });
    for (let i = 0; i <= text.length; i++) {
      await controls.start({
        opacity: 1,
        transition: { duration: 0.05 }
      });
      setQuote(text.slice(0, i));
    }
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <motion.div 
      className="bg-highlight/20 backdrop-blur-sm rounded-xl p-6 shadow-lg h-full flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h3 className="text-2xl font-semibold text-primary mb-3">Random Quote</h3>
      <motion.p className="text-text text-lg flex-grow" animate={controls}>"{quote}"</motion.p>
      <p className="text-text text-sm italic mt-2">- {author}</p>
      <motion.button
        className="mt-4 px-4 py-2 bg-accent text-background rounded-full font-semibold transition-all duration-300 flex items-center justify-center"
        whileHover={{ backgroundColor: "var(--color-primary)", color: "var(--color-background)" }}
        onClick={getRandomQuote}
      >
        <FaShuffle className="mr-2" />
        New Quote
      </motion.button>
    </motion.div>
  );
};

const SkillsShowcase = () => {
    const [skills, setSkills] = useState([]);
  
    useEffect(() => {
      fetchSkills();
    }, []);
  
    const fetchSkills = async () => {
      try {
        const [skillsResponse, projectsResponse] = await Promise.all([
          axios.get('/api/skills'),
          axios.get('/api/projects')
        ]);
  
        const skills = skillsResponse.data;
        const projects = projectsResponse.data;
  
        // Calculate skill usage
        const skillUsage = skills.map(skill => {
          const usageCount = projects.filter(project => project.skills.includes(skill.name)).length;
          return { ...skill, usageCount };
        });
  
        // Sort skills by usage count and get top 5
        const sortedSkills = skillUsage.sort((a, b) => b.usageCount - a.usageCount).slice(0, 5);
        
        // Calculate total usage for percentage
        const totalUsage = sortedSkills.reduce((sum, skill) => sum + skill.usageCount, 0);
        
        // Add percentage to each skill
        const skillsWithPercentage = sortedSkills.map(skill => ({
          ...skill,
          percentage: (skill.usageCount / totalUsage) * 100
        }));
        
        setSkills(skillsWithPercentage);
      } catch (error) {
        console.error('Error fetching skills and projects:', error);
      }
    };
  
    return (
      <motion.div
        className="bg-darkblue/20 backdrop-blur-sm rounded-xl p-6 shadow-lg h-full flex flex-col justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h3 className="text-2xl font-semibold text-primary mb-4">Top Skills</h3>
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-text">{skill.name}</span>
                <span className="text-xs font-medium text-accent">
                  {skill.usageCount} project{skill.usageCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div
                  className="bg-primary h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.percentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };
  
  export default ProfileSection;