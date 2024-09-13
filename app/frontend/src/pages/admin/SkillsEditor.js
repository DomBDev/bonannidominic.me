import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaSave, FaToggleOn, FaToggleOff, FaSearch, FaSort, FaMagic, FaEye, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import IconSelector from '../../components/common/IconSelector';
import AdminNav from './AdminNav';

const SkillPreview = ({ skill }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="bg-primary text-white p-2 rounded-md">
        <FaEye />
      </button>
      {isHovered && (
        <div className="absolute z-20 bg-muted p-4 rounded-md shadow-lg" style={{ width: '300px' }}>
          <h3 className="text-lg font-semibold mb-2">Skill Preview</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-1">Marquee Preview</h4>
              <div className="flex items-center bg-background p-2 rounded-md">
                <i className={`${skill.icon} text-2xl mr-2`} style={{ color: skill.color }}></i>
                <span className="text-text">{skill.name}</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1">SkillsSection Preview</h4>
              <div className="bg-background rounded-lg shadow-md p-4 flex flex-col items-center">
                <i className={`${skill.icon} text-3xl mb-2 text-secondary`}></i>
                <h4 className="text-lg font-semibold text-text mb-2">{skill.name}</h4>
                <p className="text-text text-center text-sm">{skill.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SkillsEditor = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedSkill, setEditedSkill] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/skills');
      setSkills(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again later.');
      setLoading(false);
    }
  };

  const handleEditClick = (skill) => {
    setEditingIndex(skill._id);
    setEditedSkill({ ...skill });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedSkill(null);
  };

  const handleSaveEdit = () => {
    if (editedSkill && editingIndex !== null) {
      const updatedSkills = skills.map(skill => 
        skill._id === editingIndex ? editedSkill : skill
      );
      setSkills(updatedSkills);
      setEditingIndex(null);
      setEditedSkill(null);
      setHasChanges(true);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedSkill(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleCore = (skillId) => {
    const updatedSkills = skills.map(skill => 
      skill._id === skillId ? { ...skill, isCore: !skill.isCore } : skill
    );
    setSkills(updatedSkills);
    setHasChanges(true);
  };

  const handleAddSkill = () => {
    setSkills([...skills, { category: '', name: '', description: '', icon: '', isCore: false, color: '#000000' }]);
    setHasChanges(true);
  };

  const handleRemoveSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      const updatedSkills = skills.filter(skill => skill._id !== skillId);
      setSkills(updatedSkills);
      setHasChanges(true);
    }
  };

  const handleSaveSkills = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/skills', skills);
      alert('Skills saved successfully!');
      setHasChanges(false);
      setSkills(response.data); // Update the skills with the returned data
    } catch (err) {
      console.error('Error saving skills:', err);
      if (err.response) {
        console.error('Server responded with:', err.response.data);
        console.error('Status code:', err.response.status);
        setError(`Failed to save skills. Server error: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Failed to save skills. No response from server. Please check your network connection.');
      } else {
        console.error('Error setting up request:', err.message);
        setError(`Failed to save skills. Error: ${err.message}`);
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSuggestSkills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects/skills');
      const projectSkills = response.data;
      const newSuggestions = projectSkills.filter(
        skill => !skills.some(existingSkill => existingSkill.name.toLowerCase() === skill.toLowerCase())
      );
      setSuggestedSkills(newSuggestions);
    } catch (err) {
      console.error('Error fetching project skills:', err);
      setError('Failed to suggest skills. Please try again.');
    }
  };

  const addSuggestedSkill = (skill) => {
    setSkills([...skills, { category: '', name: skill, description: '', icon: '', isCore: false, color: '#000000' }]);
    setSuggestedSkills(suggestedSkills.filter(s => s !== skill));
    setHasChanges(true);
  };

  const filteredAndSortedSkills = skills
    .filter(skill => 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) return <div className="text-white text-center pt-32">Loading skills...</div>;
  if (error) return <div className="text-white text-center pt-32">{error}</div>;

  return (
    <div className="pt-32 bg-gradient-to-br from-darkblue via-muted to-darkpurple min-h-screen relative px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-muted rounded-xl shadow-lg"
      >
        <AdminNav />
        <div className="p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-primary">Skills Editor</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveSkills}
                disabled={!hasChanges}
                className={`bg-primary text-white px-4 py-2 rounded-lg transition duration-300 flex items-center ${hasChanges ? 'hover:bg-secondary' : 'opacity-50 cursor-not-allowed'}`}
              >
                <FaSave className="mr-2" /> Save Changes
              </button>
            </div>
          </div>
          
          <div className="mb-4 flex justify-between items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-background text-text rounded-md p-2 pl-8 border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition duration-300"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-400" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSuggestSkills}
              className="bg-accent text-text px-4 py-2 rounded-md hover:bg-primary transition duration-300 flex items-center space-x-2"
            >
              <FaMagic />
              <span>Suggest Skills</span>
            </motion.button>
          </div>
          {suggestedSkills.length > 0 && (
            <div className="mb-4 p-4 bg-background rounded-md">
              <h2 className="text-lg font-semibold text-primary mb-2">Suggested Skills:</h2>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => addSuggestedSkill(skill)}
                    className="bg-secondary text-text px-2 py-1 rounded-full text-sm hover:bg-primary transition duration-300"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button onClick={() => handleSort('category')} className="text-text flex items-center">
              <FaSort className="mr-2" /> Sort by Category
            </button>
            <button onClick={() => handleSort('name')} className="text-text flex items-center">
              <FaSort className="mr-2" /> Sort by Name
            </button>
          </div>
          <div className="not-overflow-x-auto">
            <div className="w-full">
              <div className="flex bg-darkpurple text-text font-semibold">
                <div className="p-3 w-1/6 min-w-[100px]">Category</div>
                <div className="p-3 w-1/6 min-w-[100px]">Name</div>
                <div className="p-3 w-1/4 min-w-[150px]">Description</div>
                <div className="p-3 w-1/12 min-w-[60px]">Icon</div>
                <div className="p-3 w-1/12 min-w-[60px]">Color</div>
                <div className="p-3 w-1/12 min-w-[80px]">Core Skill</div>
                <div className="p-3 w-1/6 min-w-[120px]">Actions</div>
              </div>
              {filteredAndSortedSkills.map((skill) => (
                <div key={skill._id} className="flex border-b border-gray-700">
                  {editingIndex === skill._id ? (
                    <>
                      <div className="p-3 w-1/6 min-w-[100px]">
                        <input
                          type="text"
                          value={editedSkill.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full bg-background text-text rounded-md p-2 border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition duration-300"
                        />
                      </div>
                      <div className="p-3 w-1/6 min-w-[100px]">
                        <input
                          type="text"
                          value={editedSkill.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full bg-background text-text rounded-md p-2 border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition duration-300"
                        />
                      </div>
                      <div className="p-3 w-1/4 min-w-[150px]">
                        <textarea
                          value={editedSkill.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          className="w-full bg-background text-text rounded-md p-2 border border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition duration-300 resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="p-3 w-1/12 min-w-[60px]">
                        <IconSelector
                          value={editedSkill.icon}
                          color={editedSkill.color}
                          onChange={(value) => handleInputChange('icon', value)}
                        />
                      </div>
                      <div className="p-3 w-1/12 min-w-[60px]">
                        <input
                          type="color"
                          value={editedSkill.color}
                          onChange={(e) => handleInputChange('color', e.target.value)}
                          className="w-10 h-10 rounded-md cursor-pointer border border-gray-600"
                        />
                      </div>
                      <div className="p-3 w-1/12 min-w-[80px]">
                        <button
                          onClick={() => handleInputChange('isCore', !editedSkill.isCore)}
                          className="text-2xl focus:outline-none"
                        >
                          {editedSkill.isCore ? (
                            <FaToggleOn className="text-primary" />
                          ) : (
                            <FaToggleOff className="text-gray-500" />
                          )}
                        </button>
                      </div>
                      <div className="p-3 w-1/6 min-w-[120px]">
                        <div className="flex space-x-2">
                          <button onClick={handleSaveEdit} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300">
                            <FaCheck />
                          </button>
                          <button onClick={handleCancelEdit} className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300">
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 w-1/6 min-w-[100px] group">
                        <div className="truncate group-hover:truncate-none transition-all duration-300 ease-in-out">
                          {skill.category}
                        </div>
                      </div>
                      <div className="p-3 w-1/6 min-w-[100px] group">
                        <div className="truncate group-hover:truncate-none transition-all duration-300 ease-in-out">
                          {skill.name}
                        </div>
                      </div>
                      <div className="p-3 w-1/4 min-w-[150px] group">
                        <div className="truncate group-hover:truncate-none transition-all duration-300 ease-in-out">
                          {skill.description}
                        </div>
                      </div>
                      <div className="p-3 w-1/12 min-w-[60px]">
                        <i className={`${skill.icon} text-2xl`} style={{color: skill.color}}></i>
                      </div>
                      <div className="p-3 w-1/12 min-w-[60px]">
                        <div className="w-10 h-10 rounded-md" style={{backgroundColor: skill.color}}></div>
                      </div>
                      <div className="p-3 w-1/12 min-w-[80px]">
                        <button
                          onClick={() => handleToggleCore(skill._id)}
                          className="text-2xl focus:outline-none"
                        >
                          {skill.isCore ? (
                            <FaToggleOn className="text-primary" />
                          ) : (
                            <FaToggleOff className="text-gray-500" />
                          )}
                        </button>
                      </div>
                      <div className="p-3 w-1/6 min-w-[120px]">
                        <div className="flex space-x-2">
                          <SkillPreview skill={skill} />
                          <button onClick={() => handleEditClick(skill)} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300">
                            <FaEdit />
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveSkill(skill._id)}
                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddSkill}
              className="bg-secondary text-text px-6 py-2 rounded-md hover:bg-primary transition duration-300 flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add Skill</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SkillsEditor;