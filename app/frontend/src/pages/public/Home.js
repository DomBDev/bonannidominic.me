import React, { useState, useEffect, useCallback } from 'react';

import ScrollNav from '../../components/pages/home/ScrollNav';
import Welcome from '../../components/pages/home/Welcome';
import SkillsSection from '../../components/pages/home/SkillsSection';
import PortfolioSection from '../../components/pages/home/PortfolioSection';
import ContactSection from '../../components/pages/home/ContactSection';

const Home = () => {
  const [currentSection, setCurrentSection] = useState('');
  const [sections, setSections] = useState([]);
  const [isScrolling] = useState(false);

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

  return (
    <div className="bg-background text-text font-sans leading-relaxed flex flex-col items-center justify-center min-h-screen">
      {/* Welcome Section */}
      <Welcome />

      {/* Skills Section */}
      <SkillsSection />

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Scroll Navigation */}
      <ScrollNav sections={sections} currentSection={currentSection} />

    </div>
  );
};

export default Home;