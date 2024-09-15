import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [coreSkills, setCoreSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('/api/skills');
        const allSkills = response.data.filter(skill => skill.name && skill.category);
        const core = allSkills.filter(skill => skill.isCore);
        const nonCore = allSkills.filter(skill => !skill.isCore);
        setCoreSkills(core);
        setSkills(nonCore);
        if (nonCore.length > 0) {
          setActiveCategory(nonCore[0].category);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  return (
    <section id="skills" className="bg-background py-20 mx-12">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-4"
        >
          <h2 className="text-4xl font-bold text-primary">Skills</h2>
          <p className="mt-4 text-lg md:text-xl text-text">
            A comprehensive look at the skills and technologies I've acquired over the years.
          </p>
        </motion.div>

        {/* Core Skills */}
        {coreSkills.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-semibold text-primary mb-6 text-center">Core Skills</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {coreSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-muted rounded-lg shadow-lg p-6 flex flex-col items-center justify-center w-40 h-40 transition duration-300 hover:bg-darkpurple border border-transparent hover:border-secondary"
                >
                  <i className={`${skill.icon} text-4xl text-secondary mb-4`} />
                  <h4 className="text-lg font-semibold text-text text-center">{skill.name}</h4>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skill Categories */}
        {categories.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex justify-center space-x-4 mb-8">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full transition duration-300 ${
                    activeCategory === category
                      ? 'bg-primary text-background'
                      : 'bg-muted text-text hover:bg-darkblue'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <motion.div
              key={activeCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-muted rounded-lg shadow-lg p-6"
            >
              <h3 className="text-2xl font-semibold text-primary mb-6 text-center">{activeCategory}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {skills
                  .filter((skill) => skill.category === activeCategory)
                  .map((skill, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-background rounded-lg shadow-md p-4 flex flex-col items-center transition duration-300 hover:bg-darkpurple border border-transparent hover:border-secondary"
                    >
                      <i className={`${skill.icon} text-3xl text-secondary mb-2`} />
                      <h4 className="text-lg font-semibold text-text mb-2">{skill.name}</h4>
                      <p className="text-text text-center text-sm">{skill.description}</p>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;