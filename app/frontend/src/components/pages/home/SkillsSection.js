import { useState } from 'react';
import { motion } from 'framer-motion';

const coreSkills = [
      { name: "Full Stack Development", description: "Expertise in both client-side and server-side technologies.", icon: "fas fa-code" },
      { name: "Database Management", description: "Proficient in SQL and NoSQL databases.", icon: "fas fa-database" },
      { name: "Version Control", description: "Using Git for consistent version tracking and collaboration.", icon: "fab fa-git" },
      { name: "API Development", description: "Building RESTful services and integrating APIs.", icon: "fas fa-code-branch" },
      { name: "Cloud Computing", description: "Experience with cloud services like AWS and Azure for scalable solutions.", icon: "fas fa-cloud" },
      { name: "Cross-Platform Development", description: "Building applications that run on multiple platforms and devices.", icon: "fas fa-desktop" },
    ];

const skillsData = [
      {
        category: "Programming Languages",
        skills: [
          { name: "Python", description: "Versatile language for web development and data science.", icon: "fab fa-python" },
          { name: "JavaScript", description: "Essential language for interactive web pages.", icon: "fab fa-js" },
          { name: "SQL", description: "Database language for structured data retrieval and manipulation.", icon: "fas fa-database" },
          { name: "TypeScript", description: "JavaScript superset that adds static types for better code quality.", icon: "fab fa-js-square" },
          { name: "MicroPython", description: "Experienced in programming microcontrollers with MicroPython.", icon: "fas fa-microchip" },
        ],
      },
      {
        category: "Frameworks & Libraries",
        skills: [
          { name: "React", description: "Front-end library for building dynamic UIs.", icon: "fab fa-react" },
          { name: "Node.js", description: "JavaScript runtime for building scalable server-side applications.", icon: "fab fa-node-js" },
          { name: "Flask", description: "Lightweight framework for Python web applications.", icon: "fas fa-flask" },
          { name: "Django", description: "Robust web framework for building secure and maintainable websites.", icon: "fab fa-python" },
          { name: "Express", description: "Web framework for Node.js for building APIs.", icon: "fab fa-node-js" },
          { name: "Bootstrap", description: "Popular framework for responsive web design.", icon: "fab fa-bootstrap" },
          { name: "Tailwind CSS", description: "Utility-first CSS framework for rapid UI development.", icon: "fab fa-css3-alt" },
        ],
      },
      {
        category: "Tools & Platforms",
        skills: [
          { name: "GitHub", description: "Platform for version control and collaboration.", icon: "fab fa-github" },
          { name: "Heroku", description: "Cloud platform for deploying applications.", icon: "fas fa-cloud-upload-alt" },
          { name: "DigitalOcean", description: "Cloud infrastructure provider for hosting applications.", icon: "fas fa-cloud" },
          { name: "VS Code", description: "Popular code editor used for development.", icon: "fas fa-code" },
          { name: "Nginx", description: "High-performance web server for serving web content.", icon: "fas fa-server" },
          { name: "Linux", description: "Operating system popular among developers and system admins.", icon: "fab fa-linux" },
          { name: "Docker", description: "Containerization platform for developing and deploying applications.", icon: "fab fa-docker" },
          { name: "Arduino/ESP32/Raspberry Pi", description: "Hands-on experience with microcontrollers and single-board computers using Arduino framework, MicroPython, and occasionally C/C++ for IoT applications.", icon: "fas fa-microchip" },
          { name: "Arduino IDE", description: "Familiar with Arduino libraries and tools for rapid prototyping and embedded systems development.", icon: "fas fa-tools" },
        ],
      },
];

const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState(skillsData[0].category);

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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
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

        {/* Skill Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex justify-center space-x-4 mb-8">
            {skillsData.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full transition duration-300 ${
                  activeCategory === category.category
                    ? 'bg-primary text-background'
                    : 'bg-muted text-text hover:bg-darkblue'
                }`}
                onClick={() => setActiveCategory(category.category)}
              >
                {category.category}
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
              {skillsData
                .find((category) => category.category === activeCategory)
                .skills.map((skill, index) => (
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
      </div>
    </section>
  );
};

export default SkillsSection;