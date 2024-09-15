import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { FaEye, FaGithub, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import SkillsManagement from '../../components/pages/dashboard/SkillsManagement';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ProjectManagement from '../../components/pages/dashboard/ProjectManagement';
import AdminNav from './AdminNav';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    plannedProjects: 0,
    totalViews: 0,
    averageProjectDuration: 0,
    mostUsedSkill: '',
    mostUsedSkillCount: 0,
    averageViews: 0,
  });
  const [viewsData, setViewsData] = useState({});
  const [skillsData, setSkillsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalViews, setTotalViews] = useState(0);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

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
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    if (!token) {
      navigate('/login');
      return;
    }

    const config = {
      headers: { 'x-auth-token': token }
    };

    try {
      const [totalViewsResponse, projectsResponse, allViewsResponse] = await Promise.allSettled([
        axios.get('/api/views/total', config),
        axios.get('/api/projects', config),
        axios.get('/api/views', config)
      ]);

      if (totalViewsResponse.status === 'fulfilled') {
        setTotalViews(totalViewsResponse.value.data.totalViews);
      } else {
        console.error('Failed to fetch total views:', totalViewsResponse.reason);
      }

      if (projectsResponse.status === 'fulfilled') {
        const projectsWithViews = await Promise.all(
          projectsResponse.value.data.map(async (project) => {
            try {
              const viewsResponse = await axios.get(`/api/views/project/${project._id}`, config);
              return { ...project, views: viewsResponse.data.projectViews };
            } catch (err) {
              console.error(`Failed to fetch views for project ${project._id}:`, err);
              return { ...project, views: 0 };
            }
          })
        );

        // Calculate stats from projects data
        const calculatedStats = calculateStats(projectsWithViews);
        setStats(calculatedStats);

        // Generate skills data
        setSkillsData(generateSkillsData(projectsWithViews));
      } else {
        console.error('Failed to fetch projects:', projectsResponse.reason);
      }

      if (allViewsResponse.status === 'fulfilled') {
        // Generate views data
        setViewsData(generateViewsData(allViewsResponse.value.data.views));
      } else {
        console.error('Failed to fetch all views:', allViewsResponse.reason);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Some dashboard data could not be loaded. Please try refreshing the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (projects) => {
    const completed = projects.filter(p => p.status === 'completed').length;
    const inProgress = projects.filter(p => p.status === 'wip').length;
    const planned = projects.filter(p => p.status === 'planned').length;
    const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);

    // Calculate most used skill
    const skillCounts = {};
    projects.forEach(project => {
      project.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    const mostUsedSkill = Object.entries(skillCounts).reduce((a, b) => a[1] > b[1] ? a : b);

    return {
      totalProjects: projects.length,
      completedProjects: completed,
      inProgressProjects: inProgress,
      plannedProjects: planned,
      totalViews: totalViews,
      mostUsedSkill: mostUsedSkill[0],
      mostUsedSkillCount: mostUsedSkill[1],
      averageViews: Math.round(totalViews / projects.length),
    };
  };

  const generateViewsData = (views) => {
    if (views.length === 0) return { labels: [], datasets: [{ data: [] }] };
  
    // Sort views by timestamp
    views.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
    const firstView = new Date(views[0].timestamp);
    const now = new Date();
  
    // If all views are from the same day, use hourly intervals
    const useHourlyIntervals = firstView.toDateString() === now.toDateString();
  
    const timeIntervals = useHourlyIntervals
      ? Array.from({ length: now.getHours() - firstView.getHours() + 1 }, (_, i) => {
          const date = new Date(firstView);
          date.setHours(firstView.getHours() + i, 0, 0, 0);
          return date.getTime();
        })
      : Array.from({ length: Math.ceil((now - firstView) / (1000 * 60 * 60 * 24)) }, (_, i) => {
          const date = new Date(firstView);
          date.setDate(date.getDate() + i);
          return date.setHours(0, 0, 0, 0);
        });
  
    const viewCounts = timeIntervals.map(interval => ({
      timestamp: interval,
      count: views.filter(view => {
        const viewDate = new Date(view.timestamp);
        return useHourlyIntervals
          ? viewDate.getHours() === new Date(interval).getHours() &&
            viewDate.toDateString() === new Date(interval).toDateString()
          : viewDate.toDateString() === new Date(interval).toDateString();
      }).length
    }));
  
    const labels = viewCounts.map(vc => {
      const date = new Date(vc.timestamp);
      return useHourlyIntervals
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    });
  
    return {
      labels,
      datasets: [
        {
          label: 'Portfolio Views',
          data: viewCounts.map(vc => vc.count),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
          fill: true
        }
      ]
    };
  };

  const generateSkillsData = (projects) => {
    const skillsCount = {};
    projects.forEach(project => {
      project.skills.forEach(skill => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
      });
    });

    const labels = Object.keys(skillsCount);
    const data = Object.values(skillsCount);
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
    ];

    return {
      labels: labels,
      datasets: [
        {
          label: 'Skills Distribution',
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          hoverOffset: 4
        }
      ]
    };
  };

  const projectStatusData = {
    labels: ['Completed', 'In Progress', 'Planned'],
    datasets: [
      {
        data: [stats.completedProjects, stats.inProgressProjects, stats.plannedProjects],
        backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
        hoverOffset: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff'
        }
      },
      title: {
        display: true,
        color: '#ffffff',
        font: {
          size: 16
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#ffffff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  if (loading) return <div className="text-center py-20">Loading dashboard data...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkblue via-muted to-darkpurple py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-bold text-primary mt-20">Admin Dashboard</h1>
        <AdminNav />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Projects" value={stats.totalProjects} icon={<FaGithub />} />
          <StatsCard title="Completed Projects" value={stats.completedProjects} icon={<FaCheckCircle />} />
          <StatsCard title="Total Portfolio Views" value={totalViews} icon={<FaEye />} />
        </div>

        {/* Project Management */}
        <ProjectManagement />

        {/* Skills Management */}
        <SkillsManagement />
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">Portfolio Views Over Time</h2>
            <div style={{ height: '300px' }}>
              <Line 
                data={viewsData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: false },
                    legend: { display: false }
                  },
                  scales: {
                    ...chartOptions.scales,
                    x: {
                      ...chartOptions.scales.x,
                      ticks: {
                        ...chartOptions.scales.x.ticks,
                        maxRotation: 45,
                        minRotation: 45
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
          <div className="bg-muted p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">Project Status Distribution</h2>
            <div style={{ height: '300px' }}>
              <Pie data={projectStatusData} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: false}}}} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">Skills Distribution</h2>
            <div style={{ height: '300px' }}>
              <Bar 
                data={skillsData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: false },
                    legend: { display: false }
                  },
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      beginAtZero: true,
                      ticks: {
                        ...chartOptions.scales.y.ticks,
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="bg-muted p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">Project Insights</h2>
            <div className="space-y-4">
              <p className="text-text">
                <span className="font-semibold">Most Used Skill:</span> {stats.mostUsedSkill} (used in {stats.mostUsedSkillCount} projects)
              </p>
              <p className="text-text">
                <span className="font-semibold">Projects in Progress:</span> {stats.inProgressProjects}
              </p>
              <p className="text-text">
                <span className="font-semibold">Planned Projects:</span> {stats.plannedProjects}
              </p>
              <p className="text-text">
                <span className="font-semibold">Average Views per Project:</span> {stats.averageViews}
              </p>
              <p className="text-text">
                <span className="font-semibold">Project Completion Rate:</span> {((stats.completedProjects / stats.totalProjects) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

const StatsCard = ({ title, value, icon }) => (
  <div className="bg-muted p-6 rounded-xl shadow-lg flex items-center">
    <div className="text-4xl text-primary mr-4">{icon}</div>
    <div>
      <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
      <p className="text-3xl font-bold text-accent">{value}</p>
    </div>
  </div>
);

export default Dashboard;
