import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

import BackgroundAnimation from '../../components/pages/projects/BackgroundAnimation';
import ProjectSection from '../../components/pages/projects/ProjectSection';
import ProjectDemo from '../../components/pages/projects/ProjectDemo';
import DemoSection from '../../components/pages/projects/DemoSection';

const ProjectsHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, delay: 0.2, ease: 'easeInOut' }}
      className="text-center text-white max-w-7xl mx-auto flex flex-col justify-center items-center p-4 sm:p-8 pb-12 sm:pb-20"
    >
      <div className="text-3xl sm:text-5xl font-bold mb-4 relative inline-block">
        <div className="max-w-xs sm:max-w-sm w-full">
          <img src="https://see.fontimg.com/api/rf5/9Y2DK/N2YzOWQ5NTNjNzdhNDYwMTk1NTdhYmMwNmJiYzZjYjUudHRm/VGhlIEFyY2hpdmU/nature-beauty-personal-use.png?r=fs&h=140&w=1000&fg=000000&bg=FFFFFF&tb=1&s=140" alt="Projects" className="w-full invert" />
        </div>
        <svg
          className="absolute -left-1 -bottom-4 sm:-bottom-7 w-full h-6 sm:h-10"
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
      <p className="text-base sm:text-xl pt-4">
        Here are some of the projects I have worked on, currently working on, and planning to work on in the future.
      </p>
    </motion.div>
  );
};

const Projects = () => {
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoProjects, setDemoProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, projectsRes, orderRes] = await Promise.all([
          axios.get('/api/projects/categories'),
          axios.get('/api/projects'),
          axios.get('/api/projects/category-order')
        ]);

        setCategories(categoriesRes.data);
        setProjects(projectsRes.data);
        setCategoryOrder(orderRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const orderedCategories = categoryOrder.length > 0
    ? categoryOrder.filter(category => categories.includes(category))
    : categories;

  if (loading) {
    return <div className="text-white text-center pt-32">Loading projects...</div>;
  }

  return (
    <div className="pt-16 sm:pt-32 bg-gradient-to-br from-darkblue via-muted to-darkpurple min-h-screen relative overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap" rel="stylesheet"></link>
      <BackgroundAnimation />
      <ProjectsHeader />

      {orderedCategories.map((category, index) => (
        <ProjectSection
          key={category}
          category={category}
          projects={projects.filter(project => project.category === category)}
          defaultOpen={index === 0}
        />
      ))}

      {/* New Demo Section */}
      <DemoSection demoProjects={demoProjects} />
    </div>
  );
};

export default Projects;