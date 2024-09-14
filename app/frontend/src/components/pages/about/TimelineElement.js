import React, { useState, useEffect } from 'react';
import IconSelector from '../../common/IconSelector';
import { motion, AnimatePresence } from 'framer-motion';

const TimelineElementEditor = ({ element, onUpdate, onDelete, isExpanded }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedElement, setEditedElement] = useState(element);

    useEffect(() => {
        setEditedElement(element);
    }, [element]);

    const handleChange = (e) => {
        setEditedElement({ ...editedElement, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onUpdate(editedElement);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating timeline element:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await onDelete(element._id);
        } catch (error) {
            console.error('Error deleting timeline element:', error);
        }
    };

    const handleIconChange = (icon) => {
        setEditedElement({ ...editedElement, icon });
    };

    const handleTypeChange = (e) => {
        setEditedElement({ ...editedElement, type: e.target.value });
    };

    const renderContent = () => {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isExpanded ? 'auto' : '150px', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden w-full h-full"
                >
                    {isEditing ? renderEditForm() : renderPreview()}
                </motion.div>
            </AnimatePresence>
        );
    };

    const renderPreview = () => {
        switch (editedElement.type) {
            case 'profile':
                return <ProfilePreview element={editedElement} />;
            case 'future':
                return <FuturePreview element={editedElement} />;
            case 'event':
                return <EventPreview element={editedElement} />;
            case 'current':
                return <CurrentPreview element={editedElement} />;
            default:
                return null;
        }
    };

    const renderEditForm = () => {
        return (
            <div className="space-y-4">
                <div className="relative">
                    <select
                        name="type"
                        value={editedElement.type}
                        onChange={handleTypeChange}
                        className="w-full p-3 bg-background text-text border-2 border-accent rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 ease-in-out"
                    >
                        <option value="profile">Profile</option>
                        <option value="future">Future</option>
                        <option value="event">Event</option>
                        <option value="current">Current</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-accent">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
                {renderTypeSpecificForm()}
            </div>
        );
    };

    const renderTypeSpecificForm = () => {
        switch (editedElement.type) {
            case 'profile':
                return <ProfileEditForm formData={editedElement} handleChange={handleChange} />;
            case 'future':
                return <FutureEditForm formData={editedElement} handleChange={handleChange} />;
            case 'event':
                return <EventEditForm formData={editedElement} handleChange={handleChange} handleIconChange={handleIconChange} />;
            case 'current':
                return <CurrentEditForm formData={editedElement} handleChange={handleChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-background p-4 rounded-lg shadow-lg h-full flex flex-col w-full">
            <div className="flex mb-4 overflow-hidden w-full h-full">
                {renderContent()}
            </div>
            <div className="flex justify-start space-x-3">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSubmit}
                            className="bg-accent hover:bg-accent/80 text-background px-4 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 shadow-md"
                        >
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Save
                            </span>
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-muted hover:bg-muted/80 text-primary px-4 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-muted focus:ring-opacity-50 shadow-md"
                        >
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Cancel
                            </span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-accent hover:bg-accent/80 text-background px-4 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 shadow-md"
                        >
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Edit
                            </span>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-background px-4 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-md"
                        >
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Delete
                            </span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const ProfilePreview = ({ element }) => (
    <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-4 rounded text-center w-full">
        <h2 className="text-2xl font-bold text-primary mb-2">My Developer Profile</h2>
        <div className="text-sm">
            {Object.entries(element.profile || {}).map(([key, value]) => (
                <div key={key}>
                    <h3 className="font-semibold mt-2">{key}</h3>
                    <p>{value}</p>
                </div>
            ))}
        </div>
    </div>
);

const FuturePreview = ({ element }) => (
    <div className="bg-gradient-to-br from-secondary/20 to-accent/20 p-4 rounded text-center w-full">
        <h2 className="text-2xl font-bold text-primary mb-2">Future Plans</h2>
        <div className="text-sm">
            {Object.entries(element.future || {}).map(([key, value]) => (
                <div key={key}>
                    <h3 className="font-semibold mt-2">{key}</h3>
                    <p>{value}</p>
                </div>
            ))}
        </div>
    </div>
);

const EventPreview = ({ element }) => (
    <div className="bg-gradient-to-br from-accent/20 to-highlight/20 p-4 rounded text-center w-full">
        <div className="text-4xl mb-2">
            <i className={element.icon} />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-2">{element.year}</h2>
        <h3 className="text-xl font-semibold mb-2">{element.title}</h3>
        <p className="text-sm mb-2">{element.shortDescription}</p>
        <p className="text-xs">{element.longDescription}</p>
    </div>
);

const CurrentPreview = ({ element }) => (
    <div className="bg-gradient-to-br from-darkblue/20 to-darkpurple/20 p-4 rounded text-center w-full">
        <h2 className="text-2xl font-bold text-primary mb-2">Current</h2>
        <p className="text-sm">{element.longDescription}</p>
    </div>
);

const InputField = ({ label, name, value, onChange, type = 'text', className = '' }) => (
    <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`w-full p-2 bg-transparent text-text border-b border-gray-600 focus:outline-none focus:border-accent text-center ${className}`}
    />
);

const TextAreaField = ({ label, name, value, onChange, rows = 4 }) => {
    const textareaRef = React.useRef(null);

    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={label}
            rows={1}
            className="w-full p-2 bg-transparent text-text border-b border-gray-600 focus:outline-none focus:border-accent text-center resize-none overflow-hidden"
        />
    );
};

const ProfileEditForm = ({ formData, handleChange }) => {
    const [sections, setSections] = useState(formData.profile || {});
    const [editingKeys, setEditingKeys] = useState({});

    const handleKeyChange = (oldKey, newKey) => {
        if (oldKey === newKey) return;
        setSections(prevSections => {
            const newSections = { ...prevSections };
            newSections[newKey] = newSections[oldKey];
            delete newSections[oldKey];
            handleChange({ target: { name: 'profile', value: newSections } });
            return newSections;
        });
        setEditingKeys(prev => ({ ...prev, [oldKey]: undefined }));
    };

    const handleSectionChange = (key, value) => {
        setSections(prevSections => {
            const updatedSections = { ...prevSections, [key]: value };
            handleChange({ target: { name: 'profile', value: updatedSections } });
            return updatedSections;
        });
    };

    const addSection = () => {
        const newKey = `Section ${Object.keys(sections).length + 1}`;
        handleSectionChange(newKey, '');
    };

    const removeSection = (key) => {
        setSections(prevSections => {
            const { [key]: removed, ...rest } = prevSections;
            handleChange({ target: { name: 'profile', value: rest } });
            return rest;
        });
    };

    return (
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-4 rounded text-center space-y-4 w-full">
            <h2 className="text-2xl font-bold text-primary mb-2">My Developer Profile</h2>
            {Object.entries(sections).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={editingKeys[key] !== undefined ? editingKeys[key] : key}
                        onChange={(e) => setEditingKeys({ ...editingKeys, [key]: e.target.value })}
                        onBlur={(e) => handleKeyChange(key, e.target.value)}
                        className="w-1/3 p-2 bg-transparent text-text border-b border-gray-600 focus:outline-none focus:border-accent"
                    />
                    <textarea
                        value={value}
                        onChange={(e) => handleSectionChange(key, e.target.value)}
                        rows={value.split('\n').length}
                        className="w-2/3 p-2 bg-transparent text-text border-b border-gray-600 focus:outline-none focus:border-accent resize-none"
                    />
                    <button onClick={() => removeSection(key)} className="text-red-500 hover:text-red-700">
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </div>
            ))}
            <button onClick={addSection} className="bg-accent text-white px-4 py-2 rounded">
                Add Section
            </button>
        </div>
    );
};

const FutureEditForm = ({ formData, handleChange }) => {
    const [sections, setSections] = useState(formData.future || {});
    const [editingKeys, setEditingKeys] = useState({});

    const handleKeyChange = (oldKey, newKey) => {
        if (oldKey === newKey) return;
        setSections(prevSections => {
            const newSections = { ...prevSections };
            newSections[newKey] = newSections[oldKey];
            delete newSections[oldKey];
            handleChange({ target: { name: 'future', value: newSections } });
            return newSections;
        });
    };

    const handleSectionChange = (key, value) => {
        setSections(prevSections => {
            const updatedSections = { ...prevSections, [key]: value };
            handleChange({ target: { name: 'future', value: updatedSections } });
            return updatedSections;
        });
    };

    const addSection = () => {
        const newKey = `Title ${Object.keys(sections).length + 1}`;
        handleSectionChange(newKey, '');
    };

    const removeSection = (key) => {
        const { [key]: removed, ...rest } = sections;
        setSections(rest);
        handleChange({ target: { name: 'future', value: rest } });
    };

    return (
        <div className="bg-gradient-to-br from-secondary/20 to-accent/20 p-4 rounded text-center space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-2">Future Plans</h2>
            {Object.entries(sections).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={editingKeys[key] || key}
                        onChange={(e) => setEditingKeys({ ...editingKeys, [key]: e.target.value })}
                        onBlur={(e) => {
                            handleKeyChange(key, e.target.value);
                            setEditingKeys({ ...editingKeys, [key]: undefined });
                        }}
                        className="w-1/3 p-2 bg-transparent text-text border-b border-gray-600 focus:outline-none focus:border-accent"
                    />
                    <TextAreaField
                        value={value}
                        onChange={(e) => handleSectionChange(key, e.target.value)}
                        rows={3}
                        className="w-2/3"
                    />
                    <button onClick={() => removeSection(key)} className="text-red-500 hover:text-red-700">
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </div>
            ))}
            <button onClick={addSection} className="bg-accent text-white px-4 py-2 rounded">
                Add Section
            </button>
        </div>
    );
};

const EventEditForm = ({ formData, handleChange, handleIconChange }) => (
    <div className="bg-gradient-to-br from-accent/20 to-highlight/20 p-4 rounded text-center space-y-4">
        <div className="flex justify-center">
            <IconSelector
                value={formData.icon}
                color="currentColor"
                onChange={handleIconChange}
            />
        </div>
        <InputField
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            type="number"
        />
        <InputField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
        />
        <InputField
            label="Short Description"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
        />
        <TextAreaField
            label="Long Description"
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
        />
    </div>
);

const CurrentEditForm = ({ formData, handleChange }) => (
    <div className="bg-gradient-to-br from-darkblue/20 to-darkpurple/20 p-4 rounded text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary mb-2">Current</h2>
        <TextAreaField
            label="Current Status"
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
        />
    </div>
);

export default TimelineElementEditor;