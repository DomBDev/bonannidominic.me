import React from 'react';
import { motion } from 'framer-motion';
import BackgroundAnimation from '../../components/pages/projects/BackgroundAnimation';
import ProjectSection from '../../components/pages/projects/ProjectSection';

const projectsData = [
  {
    id: 1,
    title: 'Completed Project 1',
    description: 'A brief description of your completed project.',
    details: 'Detailed information about Completed Project 1.',
    timeline: 'Jan 2021 - Mar 2021',
    skills: ['React', 'TailwindCSS', 'Framer Motion'],
    learned: 'Learned how to integrate TailwindCSS with React and create animations using Framer Motion.',
    status: 'completed',
    image: 'https://via.placeholder.com/300',
    public: true,
  },
  {
    id: 2,
    title: 'Completed Project 2',
    description: 'A brief description of your completed project.',
    details: 'Detailed information about Completed Project 2.',
    timeline: 'Apr 2021 - Jun 2021',
    skills: ['Node.js', 'Express', 'MongoDB'],
    learned: 'Gained experience in building RESTful APIs with Node.js and Express.',
    status: 'completed',
    image: 'https://via.placeholder.com/300',
    public: false,
  },
  {
    id: 3,
    title: 'WIP Project 1',
    description: 'A brief description of your WIP project.',
    details: 'Detailed information about WIP Project 1.',
    timeline: 'Jul 2021 - Present',
    skills: ['Next.js', 'GraphQL'],
    learned: 'Currently learning how to use Next.js for server-side rendering and GraphQL for data fetching.',
    status: 'wip',
    image: 'https://via.placeholder.com/300',
    public: false,
  },
  {
    id: 4,
    title: 'Planned Project 1',
    description: 'A brief description of your planned project.',
    details: 'Detailed information about Planned Project 1.',
    timeline: 'Planned for Sep 2021',
    skills: ['TypeScript', 'Redux'],
    learned: 'Planning to learn TypeScript and Redux for state management.',
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