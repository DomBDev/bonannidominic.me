import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import IconSelector from '../../components/common/IconSelector';
import { useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';

const AboutEditor = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['x-auth-token'] = storedToken;
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  const fetchTimelineEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/timeline');
      setTimelineEvents(response.data.sort((a, b) => a.year - b.year));
    } catch (error) {
      console.error('Error fetching timeline events:', error);
    }
  };

  const navigateSection = useCallback((newSection) => {
    if (newSection >= 0 && newSection < timelineEvents.length) {
      setDirection(newSection > currentSection ? 1 : -1);
      setCurrentSection(newSection);
    }
  }, [currentSection, timelineEvents.length]);

  const handleEventUpdate = async (updatedEvent) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/timeline/${updatedEvent._id}`, updatedEvent, {
        headers: { 'x-auth-token': token }
      });
      if (response.status === 200) {
        fetchTimelineEvents();
        setIsEditing(false);
        console.log('Event updated successfully');
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating timeline event:', error);
      if (error.response && error.response.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const handleEventCreate = async (newEvent) => {
    try {
      const response = await axios.post('http://localhost:5000/api/timeline', newEvent, {
        headers: { 'x-auth-token': token }
      });
      if (response.status === 201) {
        fetchTimelineEvents();
        setIsEditing(false);
        console.log('Event created successfully');
      } else {
        throw new Error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating timeline event:', error);
      if (error.response && error.response.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const handleEventDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/timeline/${eventId}`, {
        headers: { 'x-auth-token': token }
      });
      fetchTimelineEvents();
      setCurrentSection(Math.max(0, currentSection - 1));
    } catch (error) {
      console.error('Error deleting timeline event:', error);
      if (error.response && error.response.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const calculateAge = (year) => {
    const birthDate = new Date('2006-09-02');
    const timelineDate = new Date(year, 0, 1);
    const age = timelineDate.getFullYear() - birthDate.getFullYear();
    return `${age - 1}-${age}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkblue via-muted to-darkpurple py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-bold text-primary mt-10">About Editor</h1>
        <AdminNav />

        <div className="bg-muted rounded-xl shadow-lg p-6">
          <div className="relative w-full h-[calc(90vh-300px)] overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div 
                key={currentSection}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                variants={{
                  enter: (direction) => ({
                    x: direction > 0 ? '100%' : '-100%',
                    opacity: 0
                  }),
                  center: {
                    x: 0,
                    opacity: 1
                  },
                  exit: (direction) => ({
                    x: direction < 0 ? '100%' : '-100%',
                    opacity: 0
                  })
                }}
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 25 },
                  opacity: { duration: 0.2 }
                }}
                className="w-full h-full absolute"
              >
                {timelineEvents.length > 0 && (
                  <TimelineSection 
                    event={timelineEvents[currentSection]} 
                    index={currentSection}
                    calculateAge={calculateAge}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onUpdate={handleEventUpdate}
                    onCreate={handleEventCreate}
                    onDelete={handleEventDelete}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <Button onClick={() => navigateSection(currentSection - 1)} disabled={currentSection === 0}>
              Previous
            </Button>
            <Button onClick={() => navigateSection(currentSection + 1)} disabled={currentSection === timelineEvents.length - 1}>
              Next
            </Button>
            <Button onClick={() => setIsEditing(true)} variant="accent">
              Edit
            </Button>
            <Button
              onClick={() => {
                setTimelineEvents([...timelineEvents, { year: '', title: '', icon: '', shortDescription: '', longDescription: '' }]);
                setCurrentSection(timelineEvents.length);
                setIsEditing(true);
              }}
              variant="success"
            >
              Add New
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TimelineSection = ({ event, index, calculateAge, isEditing, setIsEditing, onUpdate, onCreate, onDelete }) => {
  const [formData, setFormData] = useState(event);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

  const backgroundColors = [
    'from-primary/20 to-secondary/20',
    'from-secondary/20 to-accent/20',
    'from-accent/20 to-highlight/20',
    'from-highlight/20 to-darkblue/20',
    'from-darkblue/20 to-darkpurple/20',
    'from-darkpurple/20 to-darkgreen/20',
    'from-darkgreen/20 to-muted/20',
    'from-muted/20 to-primary/20',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIconChange = (icon) => {
    setFormData({ ...formData, icon });
    setIsIconSelectorOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData._id) {
      onUpdate(formData);
    } else {
      onCreate(formData);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="w-full h-full flex flex-col items-center justify-center p-8 bg-background text-text">
        <Input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year"
          required
        />
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <div onClick={(e) => e.preventDefault()}>
          <IconSelector
            value={formData.icon}
            onChange={handleIconChange}
            color="text-accent"
            onOpen={() => setIsIconSelectorOpen(true)}
            onClose={() => setIsIconSelectorOpen(false)}
          />
        </div>
        <TextArea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          placeholder="Short description"
          required
        />
        <TextArea
          name="longDescription"
          value={formData.longDescription}
          onChange={handleChange}
          placeholder="Long description"
          required
        />
        <div className="flex space-x-4 mt-4">
          <Button type="submit" variant="primary">Save</Button>
          <Button 
            type="button" 
            onClick={(e) => {
              e.stopPropagation();
              if (!isIconSelectorOpen) {
                setIsEditing(false);
              }
            }} 
            variant="secondary"
          >
            Cancel
          </Button>
          {event._id && (
            <Button type="button" onClick={() => onDelete(event._id)} variant="danger">Delete</Button>
          )}
        </div>
      </form>
    );
  }

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${backgroundColors[index % backgroundColors.length]} p-8`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center justify-center"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-6xl mb-4 text-primary"
        >
          <i className={event.icon} />
        </motion.div>
        <motion.h2
          whileHover={{ scale: 1.05 }}
          className="text-5xl font-bold text-primary mb-4"
        >
          {event.year}
        </motion.h2>
        <motion.h3
          whileHover={{ scale: 1.05 }}
          className="text-3xl font-semibold mb-4 text-secondary"
        >
          {event.title}
        </motion.h3>
        <motion.p
          whileHover={{ scale: 1.02 }}
          className="text-xl mb-6 max-w-2xl text-text"
        >
          {event.shortDescription}
        </motion.p>
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : '0' }}
          className="overflow-hidden"
        >
          <motion.p
            whileHover={{ scale: 1.02 }}
            className="text-lg mb-4 max-w-3xl text-text"
          >
            {event.longDescription}
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center text-accent"
          >
            <i className="fa-solid fa-child-reaching mr-2" />
            <span>Age: {calculateAge(event.year)}</span>
          </motion.div>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-primary hover:text-accent transition-colors"
        >
          <i className={isExpanded ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"} size="2x" />
        </motion.button>
      </motion.div>
    </div>
  );
};

const Button = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out shadow-md';
  const variantClasses = {
    primary: 'bg-primary text-background hover:bg-primary/80',
    secondary: 'bg-secondary text-background hover:bg-secondary/80',
    accent: 'bg-accent text-background hover:bg-accent/80',
    success: 'bg-green-500 text-background hover:bg-green-600',
    danger: 'bg-red-500 text-background hover:bg-red-600',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ ...props }) => (
  <input
    className="w-full max-w-md text-xl mb-4 text-center bg-background border-b-2 border-primary focus:border-accent transition-colors duration-200 ease-in-out outline-none"
    {...props}
  />
);

const TextArea = ({ ...props }) => (
  <textarea
    className="w-full max-w-3xl text-lg mb-4 p-2 bg-background border-2 border-highlight focus:border-accent transition-colors duration-200 ease-in-out outline-none resize-none"
    {...props}
  />
);

export default AboutEditor;