import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';
import TimelineElementEditor from '../../components/pages/about/TimelineElement';
import { setAuthToken } from '../../hooks/tokenRefresh';

const SortableItem = ({ element, onUpdate, onDelete, isExpanded }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element._id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex-shrink-0 w-96">
      <div className="bg-background p-4 rounded-lg shadow-lg h-full flex flex-col">
        <div className="cursor-move mb-2 text-primary hover:text-accent transition-colors duration-200 w-min" {...attributes} {...listeners}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <div className="mx-4 inline-block">
          <span className="px-2 py-1 text-xs font-medium bg-accent/20 text-accent rounded-full">
            {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
          </span>
        </div>
        <TimelineElementEditor
          element={element}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
};

const AboutEditor = () => {
  const [timelineElements, setTimelineElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const animationRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
    fetchTimelineElements();
  }, []);

  const fetchTimelineElements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/timeline');
      setTimelineElements(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching timeline elements:', error);
      setError('Failed to fetch timeline elements');
      setLoading(false);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = timelineElements.findIndex((item) => item._id === active.id);
      const newIndex = timelineElements.findIndex((item) => item._id === over.id);

      const newItems = Array.from(timelineElements);
      const [reorderedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, reorderedItem);

      setTimelineElements(newItems);

      const reorderData = { 
        elements: newItems.map((item, index) => ({ _id: item._id, order: index })) 
      };

      try {
        const response = await axios.put('http://localhost:5000/api/timeline/reorder', reorderData);
      } catch (error) {
        console.error('Error reordering timeline elements:', error);
        console.error('Error response:', error.response?.data);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    }
  };

  const handleElementCreate = async () => {
    try {
      const newElement = {
        type: 'event', // Default type
        year: new Date().getFullYear(),
        title: 'New Event',
        icon: 'fa-star',
        shortDescription: 'Short description',
        longDescription: 'Long description',
      };
      await axios.post('http://localhost:5000/api/timeline', newElement);
      fetchTimelineElements();
    } catch (error) {
      console.error('Error creating timeline element:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleElementUpdate = async (updatedElement) => {
    try {
      await axios.put(`http://localhost:5000/api/timeline/${updatedElement._id}`, updatedElement);
      fetchTimelineElements(); // Refresh the timeline elements after update
    } catch (error) {
      console.error('Error updating timeline element:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleElementDelete = async (elementId) => {
    try {
      await axios.delete(`http://localhost:5000/api/timeline/${elementId}`);
      fetchTimelineElements();
    } catch (error) {
      console.error('Error deleting timeline element:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isScrolling = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isScrolling = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
      isScrolling = false;
    };

    const handleMouseUp = () => {
      isScrolling = false;
    };

    const handleMouseMove = (e) => {
      if (!isScrolling) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      scrollContainer.scrollLeft += e.deltaY;
    };

    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mousemove', handleMouseMove);
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, [timelineElements]); // Add timelineElements as a dependency

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkblue via-muted to-darkpurple py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-primary mt-10">About Editor</h1>
        <AdminNav />

        <div className="bg-muted rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-semibold text-primary">Timeline Elements</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors duration-200"
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
              <button
                onClick={handleElementCreate}
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors duration-200 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Element
              </button>
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={timelineElements.map(el => el._id)} strategy={horizontalListSortingStrategy}>
              <div 
                ref={scrollContainerRef} 
                className={`overflow-x-auto pb-4 custom-scrollbar transition-all duration-300`}
              >
                <div className="flex flex-nowrap space-x-4 min-w-max">
                  {timelineElements.map((element) => (
                    <SortableItem 
                      key={element._id} 
                      element={element}
                      onUpdate={handleElementUpdate}
                      onDelete={handleElementDelete}
                      isExpanded={isExpanded}
                    />
                  ))}
                </div>
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default AboutEditor;