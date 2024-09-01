import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header.js';
import Home from './pages/public/Home.js';
import About from './pages/public/About.js';
import Projects from './pages/public/Projects.js';
import Footer from './components/layout/Footer.js';

function App() {
  return (
    <div className="App bg-background text-text w-full min-h-screen flex flex-col snap-y snap-mandatory">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"></link>
      <Header />
      <main className="w-full flex-1 overflow-y-scroll no-scrollbar">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;