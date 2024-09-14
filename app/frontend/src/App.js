import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header.js';
import Home from './pages/public/Home.js';
import About from './pages/public/About.js';
import Projects from './pages/public/Projects.js';
import Footer from './components/layout/Footer.js';
import ProjectDetails from './pages/public/ProjectDetail.js';
import ProjectEditor from './pages/admin/ProjectEditor.js';
import Login from './pages/admin/Login.js';
import Dashboard from './pages/admin/Dashboard.js';
import useRecordSiteView from './hooks/useRecordSiteView.js';
import ProtectedRoute from './components/layout/ProtectedRoute.js';
import NotFound from './pages/public/NotFound.js';
import SkillsEditor from './pages/admin/SkillsEditor.js';
import AboutEditor from './pages/admin/AboutEditor.js';
import AdminInbox from './pages/admin/AdminInbox.js';
import './hooks/tokenRefresh';

function App() {
  useRecordSiteView();

  const Logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="App bg-background text-text w-full min-h-screen flex flex-col snap-y snap-mandatory">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"></link>
      <Header />
      <main className="w-full flex-1 overflow-y-scroll no-scrollbar">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Protected Routes */}
          <Route path="/admin/projects/:id" element={
            <ProtectedRoute>
              <ProjectEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/skills" element={
            <ProtectedRoute>
              <SkillsEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/about" element={
            <ProtectedRoute>
              <AboutEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/inbox" element={
            <ProtectedRoute>
              <AdminInbox />
            </ProtectedRoute>
          } />
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;