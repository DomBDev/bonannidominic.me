import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaTrash, FaSave, FaUpload, FaPlus } from 'react-icons/fa';

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['x-auth-token'] = storedToken;
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      fetchProject();
    }
  }, [id, token]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setProject(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      if (error.response && error.response.status === 401) {
        navigate('/admin/login');
      } else {
        setError('Failed to load project. Please try again later.');
        setLoading(false);
      }
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
        await axios.delete(`http://localhost:5000/api/upload${oldItem.url}`, {
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
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
      });

      const updatedMedia = [...project.media];
      updatedMedia[index] = { 
        type: file.type.startsWith('image') ? 'image' : 'video', 
        url: response.data.url,
        filename: file.name // Store the original filename
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

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
      });

      // Delete the old image if it exists
      if (project.image && project.image.startsWith('/uploads/')) {
        await axios.delete(`http://localhost:5000/api/upload${project.image}`, {
          headers: { 'x-auth-token': token }
        });
      }

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
        await axios.delete(`http://localhost:5000/api/upload${itemToRemove.url}`, {
          headers: { 'x-auth-token': token }
        });
      } catch (error) {
        console.error('Error deleting media file:', error);
      }
    }

    setProject(prevProject => ({
      ...prevProject,
      media: prevProject.media.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/projects/${id}`, {
        ...project,
        featured: project.featured
      }, {
        headers: { 'x-auth-token': token }
      });
      alert('Project updated successfully!');
      navigate('/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      if (error.response && error.response.status === 401) {
        navigate('/admin/login');
      } else {
        setError('Failed to update project. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { 'x-auth-token': token }
        });
        alert('Project deleted successfully!');
        navigate('/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
        if (error.response && error.response.status === 401) {
          navigate('/admin/login');
        } else {
          setError('Failed to delete project. Please try again.');
        }
      }
    }
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
    <div className="pt-16 bg-gradient-to-br from-darkblue via-muted to-darkpurple min-h-screen relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-muted rounded-xl shadow-lg overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-8">
          <h1 className="text-4xl font-bold text-primary mb-8">Edit Project: {project.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <InputField label="Title" name="title" value={project.title} onChange={handleInputChange} />
              <TextAreaField label="Description" name="description" value={project.description} onChange={handleInputChange} />
              <TextAreaField label="Details" name="details" value={project.details} onChange={handleInputChange} rows={5} />
              <InputField label="Timeline" name="timeline" value={project.timeline} onChange={handleInputChange} />
            </div>
            <div className="space-y-6">
              <InputField label="Skills (comma-separated)" name="skills" value={project.skills.join(', ')} onChange={handleSkillsChange} />
              <TextAreaField label="What I Learned" name="learned" value={project.learned} onChange={handleInputChange} />
              <SelectField label="Status" name="status" value={project.status} onChange={handleInputChange} options={['completed', 'wip', 'planned']} />
              <InputField label="GitHub URL" name="github" value={project.github} onChange={handleInputChange} />
              <InputField label="Live Demo URL" name="live" value={project.live} onChange={handleInputChange} />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Main Image</h2>
            <div className="bg-background p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={project.image || ''}
                    onChange={(e) => setProject(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL"
                    className="w-full rounded-md bg-muted text-text border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 px-4 py-2"
                  />
                </div>
                <label className="cursor-pointer bg-secondary text-text px-4 py-2 rounded-md hover:bg-primary transition duration-300 flex items-center justify-center">
                  <FaUpload className="mr-2" />
                  <span>Upload Image</span>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
              {project.image && (
                <div className="mt-4">
                  <img 
                    src={project.image} 
                    alt="Project thumbnail" 
                    className="w-full h-64 object-cover rounded-md shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Media</h2>
            <div className="flex flex-wrap gap-4">
              {project.media.map((item, index) => (
                <div key={index} className="bg-background p-4 rounded-lg shadow-md">
                  <select
                    value={item.type}
                    onChange={(e) => handleMediaChange(index, 'type', e.target.value)}
                    className="w-full mb-2 rounded-md bg-muted text-text border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => handleMediaChange(index, 'url', e.target.value)}
                      placeholder="Media URL"
                      className="flex-grow rounded-md bg-muted text-text border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    />
                    <label className="cursor-pointer bg-secondary text-text p-2 rounded-md hover:bg-primary transition duration-300">
                      <FaUpload />
                      <input type="file" className="hidden" onChange={(e) => handleMediaUpload(e, index)} accept="image/*,video/*" />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeMediaItem(index)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {item.filename && (
                    <p className="text-sm text-gray-500 truncate">{item.filename}</p>
                  )}
                  {item.url && (
                    <div className="mt-2">
                      {item.type === 'image' ? (
                        <img src={item.url} alt="Uploaded media" className="w-full h-32 object-cover rounded-md" />
                      ) : (
                        <video src={item.url} className="w-full h-32 object-cover rounded-md" controls />
                      )}
                    </div>
                  )}
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
          </div>

          <div className="mt-8 mb-4">
            <div className="flex items-center space-x-3">
              <label htmlFor="featured" className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="featured"
                  checked={project.featured}
                  onChange={(e) => setProject(prev => ({ ...prev, featured: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gray-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span className="ml-3 text-sm font-medium text-gray-300">Featured Project</span>
              </label>
            </div>
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