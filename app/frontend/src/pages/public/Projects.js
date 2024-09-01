import React from 'react';
import { motion } from 'framer-motion';
import BackgroundAnimation from '../../components/common/BackgroundAnimation';
import ProjectSection from '../../components/common/ProjectSection';

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
  },
];

const Projects = () => {
  return (
    <div className="pt-32 bg-gradient-to-b from-background via-muted to-background min-h-screen relative overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap" rel="stylesheet"></link>
      <BackgroundAnimation />

      <div className="text-center pt-32 pb-24">
        <motion.h1
          className="text-6xl font-bold relative z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ fontFamily: 'Bungee Shade, cursive', color: '#6dabca' }}
        >
          Projects
        </motion.h1>
        <motion.p
          className="text-lg relative z-10 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ color: '#6dabca' }}
        >
          Here are some of my projects.
        </motion.p>
      </div>

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