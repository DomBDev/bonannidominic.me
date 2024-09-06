import React from 'react';
import { motion } from 'framer-motion';
import BackgroundAnimation from '../../components/pages/projects/BackgroundAnimation';
import ProjectSection from '../../components/pages/projects/ProjectSection';

const projectsData = [
  {
    id: 1,
    title: 'bonannidominic.me',
    description: 'Personal portfolio website using the MERN stack.',
    details: 'A comprehensive portfolio website showcasing my skills and experience as a Full Stack Web Developer. The site features a responsive design, interactive elements, and detailed sections highlighting key projects and milestones.',
    timeline: 'Jan 2021 - Mar 2021',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS'],
    learned: 'Learned how to integrate the MERN stack to create a full-featured portfolio website.',
    status: 'completed',
    image: 'https://via.placeholder.com/300',
    public: true,
  },
  {
    id: 2,
    title: 'Pineelite.com',
    description: 'Website for a web development agency using Flask, CSS, JS, and HTML.',
    details: 'Developed a dynamic website for Pineelite, a web development agency. The site includes an admin control panel, interactive multiplayer games using PeerJS, and more.',
    timeline: 'Apr 2021 - Jun 2021',
    skills: ['Flask', 'CSS', 'JavaScript', 'HTML', 'PeerJS'],
    learned: 'Gained experience in building dynamic websites with Flask and creating interactive elements using PeerJS.',
    status: 'completed',
    image: 'https://via.placeholder.com/300',
    public: false,
  },
  {
    id: 3,
    title: 'AstroDom.space',
    description: 'Old portfolio website, discontinued.',
    details: 'An earlier version of my portfolio website, showcasing my initial projects and skills. The site is no longer maintained, but the public repository is available.',
    timeline: 'Jul 2021 - Sep 2021',
    skills: ['HTML', 'CSS', 'JavaScript'],
    learned: 'Learned the basics of web development and portfolio creation.',
    status: 'completed',
    image: 'https://via.placeholder.com/300',
    public: true,
  },
  {
    id: 4,
    title: 'bonannidominic.me (WIP)',
    description: 'Work in progress for the updated personal portfolio website.',
    details: 'Currently working on enhancing my portfolio website with new features and improved design. The site will include additional sections, interactive elements, and a more comprehensive showcase of my projects.',
    timeline: 'Jul 2021 - Present',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS'],
    learned: 'Continuing to improve my skills in full stack development and responsive design.',
    status: 'wip',
    image: 'https://via.placeholder.com/300',
    public: true,
  },
  {
    id: 5,
    title: 'ImageFX Inc. Website',
    description: 'Dynamic website for a printing/graphic design company.',
    details: 'Developing a dynamic website for ImageFX Inc., a printing and graphic design company. The site will feature an e-commerce platform, interactive design tools, and a user-friendly interface.',
    timeline: 'Planned for Sep 2021',
    skills: ['Flask', 'CSS', 'HTML', 'JavaScript'],
    learned: 'Planning to enhance my skills in e-commerce development and interactive web design.',
    status: 'wip',
    image: 'https://via.placeholder.com/300',
    public: false,
  },
  {
    id: 6,
    title: 'ECommerce-Template/website',
    description: 'Template for creating personal e-commerce websites using the MERN stack.',
    details: 'Developing a template for creating personal e-commerce websites. The template will be easy to replicate and customize for various e-commerce projects.',
    timeline: 'Planned for Oct 2021',
    skills: ['React', 'Node.js', 'Express', 'MongoDB'],
    learned: 'Planning to improve my skills in e-commerce development and template creation.',
    status: 'wip',
    image: 'https://via.placeholder.com/300',
    public: false,
  },
  {
    id: 7,
    title: 'Bubblefy',
    description: 'Bubble-themed interactive learning platform.',
    details: 'Planning to develop an interactive learning platform with a bubble-themed interface. The platform will feature recursive categories and a custom presentation builder tool to enhance the learning experience.',
    timeline: 'Planned for Nov 2021',
    skills: ['React', 'Node.js', 'Express', 'MongoDB'],
    learned: 'Planning to explore new ways of interactive learning and presentation building.',
    status: 'planned',
    image: 'https://via.placeholder.com/300',
    public: false,
  },
  {
    id: 8,
    title: 'Finance Manager',
    description: 'Finance manager built with the MERN stack.',
    details: 'Planning to develop a finance manager application that allows users to manage their finances. Features will include account creation, income/expense tracking, net worth graphing, budget management, and live stock price updates.',
    timeline: 'Planned for Dec 2021',
    skills: ['React', 'Node.js', 'Express', 'MongoDB'],
    learned: 'Planning to enhance my skills in financial application development and data visualization.',
    status: 'planned',
    image: 'https://via.placeholder.com/300',
    public: false,
  },
];

const ProjectsHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, delay: 0.2, ease: 'easeInOut' }}
      className="text-center text-white max-w-7xl mx-auto flex flex-col justify-center items-center p-8 pb-20"
    >
      <div className="text-5xl font-bold mb-4 relative inline-block">
        <div className="max-w-sm w-full">
          <img src="https://see.fontimg.com/api/rf5/9Y2DK/N2YzOWQ5NTNjNzdhNDYwMTk1NTdhYmMwNmJiYzZjYjUudHRm/VGhlIEFyY2hpdmU/nature-beauty-personal-use.png?r=fs&h=140&w=1000&fg=000000&bg=FFFFFF&tb=1&s=140" alt="Projects" className="w-full invert" />
        </div>
        <svg
          className="absolute -left-1 -bottom-7 w-full h-10"
          viewBox="0 0 100 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0 5 Q 25 0, 50 5 T 100 5"
            stroke="url(#gradient)"
            strokeWidth="1"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.95, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6dabca" />
              <stop offset="1" stopColor="#8e7cc3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <p className="text-xl pt-4">
        Here are some of the projects I have worked on, currently working on, and planning to work on in the future.
      </p>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <div className="pt-32 bg-gradient-to-br from-darkblue via-muted to-darkpurple min-h-screen relative overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap" rel="stylesheet"></link>
      <BackgroundAnimation />
      <ProjectsHeader />

      <ProjectSection
        sectionTitle="Completed Projects"
        projects={projectsData.filter((project) => project.status === 'completed')}
        defaultOpen={true}
      />
      <ProjectSection
        sectionTitle="Work In Progress"
        projects={projectsData.filter((project) => project.status === 'wip')}
        defaultOpen={false}
      />
      <ProjectSection
        sectionTitle="Planned Projects"
        projects={projectsData.filter((project) => project.status === 'planned')}
        defaultOpen={false}
      />
    </div>
  );
};

export default Projects;