import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaFilePdf } from 'react-icons/fa';

const ContactSection = () => {
    return (
        <section id="contact" className="min-h-screen flex items-center justify-center bg-background px-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, x: '-100%' }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="text-center max-w-2xl"
            >
                <h2 className="text-4xl font-bold text-primary">Get In Touch</h2>
                <div className="flex justify-center space-x-4 mt-4">
                    <motion.a
                        href="https://github.com/DomBDev"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-white hover:text-highlight transition duration-300"
                    >
                        <FaGithub className="text-3xl" />
                    </motion.a>
                    <motion.a
                        href="https://linkedin.com/in/bonanni-dominic"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-white hover:text-highlight transition duration-300"
                    >
                        <FaLinkedin className="text-3xl" />
                    </motion.a>
                    <motion.a
                        href="https://twitter.com/DomBDev"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-white hover:text-highlight transition duration-300"
                    >
                        <FaTwitter className="text-3xl" />
                    </motion.a>
                    <motion.a
                    href="/WebResume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative group"
                >
                    <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 35, -35, 0] }}
                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                    className="text-highlight hover:text-primary transition duration-300"
                    >
                        <FaFilePdf className="text-3xl" />
                    </motion.div>
                    <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View/Download Resume
                    </div>
                </motion.a>
                </div>
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
                        className="w-full p-2 rounded-lg bg-secondary text-text font-bold hover:bg-primary transition duration-300"
                    >
                        Send Message
                    </button>
                </form>
            </motion.div>
        </section>
    );
};

export default ContactSection;