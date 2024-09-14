import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaFilePdf } from 'react-icons/fa';
import axios from 'axios';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ message: 'Sending...', type: 'info' });

        try {
            await axios.post('http://localhost:5000/api/contacts', formData);
            setNotification({ message: 'Message sent successfully!', type: 'success' });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            setNotification({ message: 'Failed to send message. Please try again.', type: 'error' });
        }
    };

    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ message: '', type: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

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
                        href="https://twitter.com/"
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
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            className="w-full p-2 rounded-lg bg-muted text-text focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            className="w-full p-2 rounded-lg bg-muted text-text focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your Message"
                            className="w-full p-2 rounded-lg bg-muted text-text focus:outline-none focus:ring-2 focus:ring-primary"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 rounded-lg bg-secondary text-text font-bold hover:bg-primary transition duration-300 z-10"
                    >
                        Send Message
                    </button>
                </form>
                <AnimatePresence>
                    {notification.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className={`mt-4 p-2 rounded-lg ${
                                notification.type === 'success' ? 'bg-accent' :
                                notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                            } text-white`}
                        >
                            {notification.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

export default ContactSection;