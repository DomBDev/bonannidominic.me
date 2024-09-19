import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaSave, FaUpload, FaPlus, FaCheckCircle, FaCalendar, FaGithub, FaExternalLinkAlt, FaTags, FaEye, FaEyeSlash } from 'react-icons/fa';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [showStatusPopover, setShowStatusPopover] = useState(false);
  const [showCategoryPopover, setShowCategoryPopover] = useState(false);
  const [showSkillsPopover, setShowSkillsPopover] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('details');
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [showCategoryOrderEditor, setShowCategoryOrderEditor] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['x-auth-token'] = storedToken;
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      fetchProject();
      fetchCategories();
      fetchStatuses();
      fetchCategoryOrder();
    }
  }, [id, token]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`, {
        headers: { 'x-auth-token': token }
      });
      const projectData = response.data;
      // Set a default category if it's missing
      if (!projectData.category && categories.length > 0) {
        projectData.category = categories[0];
      }
      setProject(projectData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load project. Please try again later.');
        setLoading(false);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/projects/categories', {
        headers: { 'x-auth-token': token }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axios.get('/api/projects/statuses', {
        headers: { 'x-auth-token': token }
      });
      setStatuses(response.data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }
      setError('Failed to load statuses. Please try again later.');
    }
  };

  const fetchCategoryOrder = async () => {
    try {
      const response = await axios.get('/api/projects/category-order', {
        headers: { 'x-auth-token': token }
      });
      setCategoryOrder(response.data);
    } catch (error) {
      console.error('Error fetching category order:', error);
    }
  };

  const handleCategoryOrderChange = async (result) => {
    if (!result.destination) return;

    const items = Array.from(categoryOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategoryOrder(items);

    try {
      await axios.put('/api/projects/category-order', { order: items }, {
        headers: { 'x-auth-token': token }
      });
    } catch (error) {
      console.error('Error updating category order:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject(prevProject => ({
      ...prevProject,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setProject(prevProject => ({
      ...prevProject,
      skills
    }));
  };

  const handleMediaChange = async (index, field, value) => {
    const updatedMedia = [...project.media];
    const oldItem = updatedMedia[index];

    if (field === 'url' && oldItem.url !== value && oldItem.url.startsWith('/uploads/')) {
      try {
        await axios.delete(`/api/upload${oldItem.url}`, {
          headers: { 'x-auth-token': token }
        });
      } catch (error) {
        console.error('Error deleting old media file:', error);
      }
    }

    updatedMedia[index][field] = value;
    setProject(prevProject => ({
      ...prevProject,
      media: updatedMedia
    }));
  };

  const handleMediaUpload = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
      });

      const updatedMedia = [...project.media];
      updatedMedia[index] = { 
        type: file.type.startsWith('image') ? 'image' : 'video', 
        url: response.data.url,
        filename: file.name
      };

      setProject(prevProject => ({
        ...prevProject,
        media: updatedMedia
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
      });

      // Attempt to delete the old image if it exists
      if (project.image && project.image.startsWith('/uploads/')) {
        const oldFilename = project.image.split('/').pop();
        try {
          await axios.delete(`/api/upload/${oldFilename}`, {
            headers: { 'x-auth-token': token }
          });
        } catch (deleteError) {
          console.log('Error deleting old image:', deleteError);
          // Continue with the new image upload even if deletion fails
        }
      }

      // Update the project with the new image URL
      setProject(prevProject => ({
        ...prevProject,
        image: response.data.url
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const addMediaItem = () => {
    setProject(prevProject => ({
      ...prevProject,
      media: [...prevProject.media, { type: 'image', url: '' }]
    }));
  };

  const removeMediaItem = async (index) => {
    const itemToRemove = project.media[index];
    if (itemToRemove.url.startsWith('/uploads/')) {
      try {
        await axios.delete(`/api/upload${itemToRemove.url}`, {
          headers: { 'x-auth-token': token }
        });
      } catch (error) {
        console.error('Error deleting media file:', error);
      }
    }

    // Delete the old image if it exists
    if (project.image && project.image.startsWith('/uploads/')) {
      await axios.delete(`/api/upload${project.image}`, {
        headers: { 'x-auth-token': token }
      });
    }

    setProject(prevProject => ({
      ...prevProject,
      media: prevProject.media.filter((_, i) => i !== index)
    }));
  };

  const handleAddStatus = async () => {
    if (newStatus.trim()) {
      try {
        await axios.post('/api/projects/statuses', { status: newStatus }, {
          headers: { 'x-auth-token': token }
        });
        setStatuses([...statuses, newStatus]);
        setProject(prevProject => ({
          ...prevProject,
          status: newStatus
        }));
        setNewStatus('');
        setShowStatusPopover(false);
      } catch (error) {
        console.error('Error adding status:', error);
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await axios.post('/api/projects/categories', { category: newCategory }, {
          headers: { 'x-auth-token': token }
        });
        setCategories([...categories, newCategory]);
        setProject(prevProject => ({
          ...prevProject,
          category: newCategory
        }));
        setNewCategory('');
        setShowCategoryPopover(false);
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !project.skills.includes(newSkill.trim())) {
      setProject(prevProject => ({
        ...prevProject,
        skills: [...prevProject.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProject(prevProject => ({
      ...prevProject,
      skills: prevProject.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(prevCrop => ({
      ...prevCrop,
      unit: '%',
      width: 100,
      height: (100 * 9) / 16,
      x: 0,
      y: (height - (height * 9) / 16) / 2,
    }));
  };

  const handleCompleteCrop = (crop) => {
    setCompletedCrop(crop);
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    if (!crop || !canvas || !image) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  };

  const handleSaveCroppedImage = () => {
    if (!completedCrop || !previewCanvasRef.current) return;

    previewCanvasRef.current.toBlob(
      (blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'cropped_image.jpg');

        axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
        })
        .then(response => {
          setProject(prevProject => ({
            ...prevProject,
            image: response.data.url
          }));
        })
        .catch(error => {
          console.error('Error uploading cropped image:', error);
        });
      },
      'image/jpeg',
      1
    );
  };

  const handleMediaCaptionChange = (index, caption) => {
    const updatedMedia = [...project.media];
    updatedMedia[index].caption = caption;
    setProject(prevProject => ({
      ...prevProject,
      media: updatedMedia
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure category is included and has a value
      if (!project.category) {
        setError('Category is required. Please select or add a category.');
        return;
      }

      await axios.put(`/api/projects/${id}`, {
        ...project,
        featured: project.featured,
        category: project.category // Explicitly include the category
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('Project updated successfully!');
      navigate('/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        setError(`Failed to update project: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${id}`, {
          headers: { 'x-auth-token': token }
        });
        alert('Project deleted successfully!');
        navigate('/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to delete project. Please try again.');
        }
      }
    }
  };

  const toggleCategoryOrderEditor = () => {
    setShowCategoryOrderEditor(!showCategoryOrderEditor);
  };

  const togglePublicStatus = () => {
    setProject(prevProject => ({
      ...prevProject,
      public: !prevProject.public
    }));
  };

  if (loading) {
    return <div className="text-white text-center pt-32">Loading project details...</div>;
  }

  if (error) {
    return <div className="text-white text-center pt-32">{error}</div>;
  }

  if (!project) {
    return <div className="text-white text-center pt-32">Project not found.</div>;
  }

  return (
    <div className="pt-32 bg-gradient-to-br from-darkblue via-muted to-darkpurple min-h-screen relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-muted rounded-xl shadow-lg overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            <InputField
              name="title"
              value={project.title}
              onChange={handleInputChange}
              className="w-full text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0"
            />
          </h1>
          <TextAreaField
            name="description"
            value={project.description}
            onChange={handleInputChange}
            className="text-xl text-text mb-6 w-full bg-transparent border-none focus:outline-none focus:ring-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="relative">
                <img
                  src={project.image || 'placeholder-image-url'}
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <label className="absolute bottom-2 left-2 cursor-pointer bg-primary text-text px-3 py-1 rounded-md hover:bg-secondary transition duration-300">
                  <FaUpload className="inline-block mr-2" />
                  <span>Change Image</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="grid grid-cols-1 gap-4">
                <motion.div 
                  className="flex items-center p-2 rounded-lg"
                  whileHover={{ y: -5, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  <FaCalendar className="text-primary text-3xl mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Timeline</h3>
                    <InputField
                      name="timeline"
                      value={project.timeline}
                      onChange={handleInputChange}
                      className="text-text bg-transparent border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center p-2 rounded-lg"
                  whileHover={{ y: -5, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  <FaCheckCircle className="text-primary text-3xl mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Status</h3>
                    <div className="relative">
                      <SelectField
                        name="status"
                        value={project.status}
                        onChange={handleInputChange}
                        options={statuses}
                        className="text-text capitalize bg-transparent border-none focus:outline-none focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStatusPopover(true)}
                        className="absolute right-0 top-0 text-primary hover:text-secondary"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center p-2 rounded-lg"
                  whileHover={{ y: -5, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTags className="text-primary text-3xl mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Category</h3>
                    <div className="relative">
                      <SelectField
                        name="category"
                        value={project.category}
                        onChange={handleInputChange}
                        options={categories}
                        className="text-text capitalize bg-transparent border-none focus:outline-none focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCategoryPopover(true)}
                        className="absolute right-0 top-0 text-primary hover:text-secondary"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={toggleCategoryOrderEditor}
                      className="mt-2 text-primary hover:text-secondary text-sm"
                    >
                      Edit Category Order
                    </button>
                  </div>
                </motion.div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <InputField
                  name="github"
                  value={project.github}
                  onChange={handleInputChange}
                  placeholder="GitHub URL"
                  className="bg-primary text-text px-6 py-2 rounded-lg"
                />
                <InputField
                  name="live"
                  value={project.live}
                  onChange={handleInputChange}
                  placeholder="Live Demo URL"
                  className="bg-primary text-text px-6 py-2 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex border-b border-gray-600">
              {['details', 'skills', 'learned', 'media'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`px-4 py-2 ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-text'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-primary mb-4">Project Details</h2>
                    <TextAreaField
                      name="details"
                      value={project.details}
                      onChange={handleInputChange}
                      className="text-text w-full bg-transparent border-none focus:outline-none focus:ring-0"
                      rows={5}
                    />
                  </motion.div>
                )}
                {activeTab === 'skills' && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-primary mb-4">Skills Used</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map((skill, index) => (
                        <div key={index} className="bg-secondary text-text px-3 py-1 rounded-full text-sm flex items-center">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center">
                      <InputField
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a new skill"
                        className="text-text bg-transparent border-none focus:outline-none focus:ring-0 flex-grow"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="ml-2 bg-primary text-text px-3 py-1 rounded-md hover:bg-secondary transition duration-300"
                      >
                        Add Skill
                      </button>
                    </div>
                  </motion.div>
                )}
                {activeTab === 'learned' && (
                  <motion.div
                    key="learned"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-primary mb-4">What I Learned</h2>
                    <TextAreaField
                      name="learned"
                      value={project.learned}
                      onChange={handleInputChange}
                      className="text-text w-full bg-transparent border-none focus:outline-none focus:ring-0"
                      rows={5}
                    />
                  </motion.div>
                )}
                {activeTab === 'media' && (
                  <motion.div
                    key="media"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold text-primary mb-4">Project Media</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.media.map((item, index) => (
                        <div key={index} className="bg-background rounded-lg overflow-hidden shadow-md">
                          {item.type === 'image' ? (
                            <img src={item.url} alt={`Project media ${index + 1}`} className="w-full h-48 object-cover" />
                          ) : (
                            <video src={item.url} controls className="w-full h-48 object-cover">
                              Your browser does not support the video tag.
                            </video>
                          )}
                          <div className="p-2">
                            <SelectField
                              value={item.type}
                              onChange={(e) => handleMediaChange(index, 'type', e.target.value)}
                              options={['image', 'video']}
                              className="mb-2 w-full bg-transparent border-none focus:outline-none focus:ring-0"
                            />
                            <InputField
                              value={item.url}
                              onChange={(e) => handleMediaChange(index, 'url', e.target.value)}
                              placeholder="Media URL"
                              className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                            />
                            <InputField
                              value={item.caption || ''}
                              onChange={(e) => handleMediaCaptionChange(index, e.target.value)}
                              placeholder="Caption"
                              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 mt-2"
                            />
                            <div className="flex justify-between mt-2">
                              <label className="cursor-pointer bg-secondary text-text px-3 py-1 rounded-md hover:bg-primary transition duration-300">
                                <FaUpload className="inline-block mr-2" />
                                <span>Upload</span>
                                <input type="file" className="hidden" onChange={(e) => handleMediaUpload(e, index)} accept="image/*,video/*" />
                              </label>
                              <button
                                type="button"
                                onClick={() => removeMediaItem(index)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                              >
                                <FaTrash className="inline-block mr-2" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addMediaItem}
                      className="mt-4 bg-secondary text-text px-4 py-2 rounded-md hover:bg-primary transition duration-300 flex items-center space-x-2"
                    >
                      <FaPlus />
                      <span>Add Media Item</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Public/Private Toggle */}
          <div className="mt-6 flex items-center">
            <span className="mr-4 text-text">Project Visibility:</span>
            <button
              type="button"
              onClick={togglePublicStatus}
              className={`flex items-center px-4 py-2 rounded-full transition-colors duration-300 ${
                project.public
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {project.public ? (
                <>
                  <FaEye className="mr-2" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <FaEyeSlash className="mr-2" />
                  <span>Private</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-8 flex justify-between">
            <motion.button
              type="submit"
              className="bg-primary text-text px-6 py-2 rounded-lg hover:bg-secondary transition duration-300 flex items-center space-x-2"
              whileHover={{ backgroundColor: '#4a5568' }}
              whileTap={{ y: 2 }}
            >
              <FaSave />
              <span>Save Changes</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300 flex items-center space-x-2"
              whileHover={{ backgroundColor: '#c53030' }}
              whileTap={{ y: 2 }}
            >
              <FaTrash />
              <span>Delete Project</span>
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Status Popover */}
      <AnimatePresence>
        {showStatusPopover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-muted rounded-lg p-6 w-96 shadow-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Add New Status</h3>
              <InputField
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                placeholder="Enter new status"
                className="w-full mb-4 bg-background text-text"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowStatusPopover(false)}
                  className="mr-2 px-4 py-2 text-text hover:text-primary transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddStatus}
                  className="px-4 py-2 bg-primary text-text rounded-lg hover:bg-secondary transition duration-300"
                >
                  Add Status
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Popover */}
      <AnimatePresence>
        {showCategoryPopover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-muted rounded-lg p-6 w-96 shadow-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Add New Category</h3>
              <InputField
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
                className="w-full mb-4 bg-background text-text"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCategoryPopover(false)}
                  className="mr-2 px-4 py-2 text-text hover:text-primary transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-primary text-text rounded-lg hover:bg-secondary transition duration-300"
                >
                  Add Category
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Order Editor */}
      <AnimatePresence>
        {showCategoryOrderEditor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="bg-muted rounded-lg p-6 w-96 shadow-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Edit Category Order</h3>
              <DragDropContext onDragEnd={handleCategoryOrderChange}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                      {categoryOrder.map((category, index) => (
                        <Draggable key={category} draggableId={category} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-background text-text p-2 mb-2 rounded-md"
                            >
                              {category}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowCategoryOrderEditor(false)}
                  className="px-4 py-2 bg-primary text-text rounded-lg hover:bg-secondary transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-text mb-1">{label}</label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md bg-background text-text border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, rows = 3 }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-text mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full rounded-md bg-background text-text border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
    ></textarea>
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-text mb-1">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md bg-background text-text border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
    >
      {options.map(option => (
        <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
      ))}
    </select>
  </div>
);

export default ProjectEditor;