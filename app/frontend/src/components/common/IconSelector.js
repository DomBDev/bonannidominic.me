import React, { useState } from 'react';

const IconSelector = ({ value, color, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
  
    const iconList = [
      // Programming and Development
      'fas fa-code', 'fas fa-bug', 'fas fa-terminal', 'fas fa-database', 'fas fa-laptop-code',
      'fas fa-file-code', 'fas fa-code-branch', 'fas fa-sitemap', 'fas fa-server', 'fas fa-cloud',
      'fas fa-microchip', 'fas fa-cogs', 'fas fa-robot', 'fas fa-cubes', 'fas fa-layer-group',
  
      // Web Technologies
      'fab fa-html5', 'fab fa-css3-alt', 'fab fa-js-square', 'fab fa-react', 'fab fa-angular',
      'fab fa-vuejs', 'fab fa-node-js', 'fab fa-npm', 'fab fa-yarn', 'fab fa-sass',
  
      // Programming Languages
      'fab fa-python', 'fab fa-java', 'fab fa-php', 'fab fa-swift', 'fab fa-cuttlefish',
      'fab fa-rust', 'fab fa-golang',
  
      // Version Control
      'fab fa-git', 'fab fa-github', 'fab fa-gitlab', 'fab fa-bitbucket',
  
      // Cloud and DevOps
      'fab fa-aws', 'fab fa-docker', 'fab fa-digital-ocean', 'fab fa-google-drive',
  
      // IDEs and Tools
      'fab fa-visual-studio-code', 'fab fa-android-studio', 'fab fa-jira',
  
      // Operating Systems
      'fab fa-windows', 'fab fa-apple', 'fab fa-linux', 'fab fa-ubuntu',
  
      // Databases
      'fas fa-database', 'fab fa-mongodb', 'fas fa-table',
  
      // AI and Machine Learning
      'fas fa-brain', 'fas fa-chart-line',
  
      // IoT and Hardware
      'fas fa-raspberry-pi',
  
      // Networking
      'fas fa-network-wired', 'fas fa-wifi', 'fas fa-broadcast-tower',
  
      // Security
      'fas fa-shield-alt', 'fas fa-lock', 'fas fa-user-shield',
  
      // Social Media
      'fab fa-facebook', 'fab fa-twitter', 'fab fa-instagram', 'fab fa-linkedin',
      'fab fa-youtube', 'fab fa-twitch', 'fab fa-discord', 'fab fa-slack',
  
      // General Tech
      'fas fa-laptop', 'fas fa-desktop', 'fas fa-tablet-alt',
      'fas fa-keyboard', 'fas fa-mouse', 'fas fa-headphones', 'fas fa-gamepad',
  
      // Misc
      'fas fa-lightbulb', 'fas fa-rocket', 'fas fa-puzzle-piece', 'fas fa-project-diagram'
    ];

    const uniqueIconList = [...new Set(iconList)];
  
    const filteredIcons = uniqueIconList.filter(icon => 
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div className="relative">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-md flex items-center justify-center mr-2">
            <i className={`${value} text-2xl`} style={{color: color}}></i>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-primary text-white w-max px-2 py-1 rounded-md hover:bg-secondary transition duration-300"
          >
            <i className="fas fa-caret-down"></i>
          </button>
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-2 w-64 max-h-60 bg-background border border-gray-300 rounded-md shadow-lg overflow-y-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border-b border-gray-300"
              placeholder="Search icons"
            />
            <div className="grid grid-cols-4 gap-2 p-2">
              {filteredIcons.map((iconClass) => (
                <button
                  key={iconClass}
                  onClick={() => {
                    onChange(iconClass);
                    setIsOpen(false);
                  }}
                  className="p-2 hover:bg-muted rounded-md"
                >
                  <i className={iconClass} style={{color: color}}></i>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

export default IconSelector;