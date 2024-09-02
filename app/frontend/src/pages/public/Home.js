import React, { useState, useEffect, useCallback } from 'react';
import ScrollNav from '../../components/common/ScrollNav';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import Welcome from '../../components/common/Welcome';
import SkillsSection from '../../components/common/SkillsSection';

const Home = () => {
  const [currentSection, setCurrentSection] = useState('');
  const [sections, setSections] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(() => {
    if (isScrolling) return;

    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + window.innerHeight / 2;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const sectionId = section.getAttribute('id');
        if (currentSection !== sectionId) {
          setCurrentSection(sectionId);
        }
      }
    });
  }, [currentSection, isScrolling]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const sectionElements = document.querySelectorAll('section');
    const sectionIds = Array.from(sectionElements).map(section => section.getAttribute('id'));
    setSections(sectionIds);
    if (sectionIds.length > 0) {
      setCurrentSection(sectionIds[0]);
    }
  }, []);

  const handleSetActive = (to) => {
    setIsScrolling(true);
    setCurrentSection(to);
    setTimeout(() => setIsScrolling(false), 1000);
  };
  return (
    <div className="bg-background text-text font-sans leading-relaxed flex flex-col items-center justify-center min-h-screen">
      {/* Welcome Section */}
      <Welcome />

      {/* Skills Section */}
      <SkillsSection />

      {/* Portfolio Section */}
      <section id="portfolio" className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold text-primary"
          >
            My Portfolio
          </motion.h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="bg-muted rounded-lg shadow-lg p-4"
            >
              <h3 className="text-2xl font-bold text-text">Project 1</h3>
              <p className="mt-2 text-lg text-highlight">A brief description of your project.</p>
              <a href="#" className="text-primary hover:text-text mt-4 inline-block">View Project</a>
            </motion.div>
            {/* Project Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="bg-muted rounded-lg shadow-lg p-4"
            >
              <h3 className="text-2xl font-bold text-text">Project 2</h3>
              <p className="mt-2 text-lg text-highlight">A brief description of your project.</p>
              <a href="#" className="text-primary hover:text-text mt-4 inline-block">View Project</a>
            </motion.div>
            {/* Additional Project Cards */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="bg-muted rounded-lg shadow-lg p-4"
            >
              <h3 className="text-2xl font-bold text-text">Project 3</h3>
              <p className="mt-2 text-lg text-highlight">A brief description of your project.</p>
              <a href="#" className="text-primary hover:text-text mt-4 inline-block">View Project</a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="bg-muted rounded-lg shadow-lg p-4"
            >
              <h3 className="text-2xl font-bold text-text">Project 4</h3>
              <p className="mt-2 text-lg text-highlight">A brief description of your project.</p>
              <a href="#" className="text-primary hover:text-text mt-4 inline-block">View Project</a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl"
        >
          <h2 className="text-4xl font-bold text-primary">Get In Touch</h2>
          <p className="mt-4 text-lg md:text-xl text-text">
            I'm always open to discussing new projects or opportunities. Feel free to reach out via email or connect with me on social media.
          </p>
          <form className="mt-6 space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-2 rounded-lg bg-muted text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-2 rounded-lg bg-muted text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <textarea
                placeholder="Your Message"
                className="w-full p-2 rounded-lg bg-muted text-text focus:outline-none focus:ring-2 focus:ring-primary"
                rows="4"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full p-2 rounded-lg bg-secondary text-text font-bold hover:bg-secondary transition duration-300"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </section>
      <ScrollNav sections={sections} currentSection={currentSection} />
    </div>
  );
};

export default Home;