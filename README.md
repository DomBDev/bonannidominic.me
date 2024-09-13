# bonannidominic.me

Welcome to the repository for my portfolio website! This project showcases my skills and experience as a Full Stack Web Developer, utilizing modern web technologies and best practices in web development.

## Project Overview

This personal portfolio website effectively highlights my journey, skills, and accomplishments in web development, programming, and related fields. It serves as a comprehensive showcase of my abilities and a central hub for potential employers, collaborators, and others interested in my work.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Key Implementations](#key-implementations)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Key Components](#key-components)

## Features

### Frontend

- **Responsive Design:** Fully responsive layout providing a seamless experience across desktop, tablet, and mobile devices.
- **Interactive UI:** Smooth animations and transitions using Framer Motion for an engaging user experience.
- **Dynamic Content:** All content is dynamically loaded from the backend, ensuring up-to-date information.
- **Project Showcase:** Detailed section highlighting key projects, including skills used, timelines, learnings, and links to GitHub repositories and live demos.
- **Interactive ScrollNav:** Custom-built navigation for smooth scrolling through different sections of the site.
- **Contact Form:** Functional contact form for inquiries, integrated with backend for data persistence.

### Backend

- **RESTful API:** Comprehensive set of endpoints for managing projects, skills, about information, and contact messages.
- **Database Integration:** MongoDB integration for efficient data storage and retrieval.
- **File Uploads:** Handling of image and media uploads for projects and other content.
- **Authentication:** Secure user authentication for accessing the admin panel.
- **Admin Panel/CMS:** Full-featured Content Management System for easy updates to all site content.
- **Message Inbox:** System for managing and responding to contact form submissions.
- **View Tracking:** Tracks and displays view counts for the portfolio and individual projects.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Authentication:** JSON Web Tokens (JWT)
- **Deployment:** DigitalOcean, Nginx, CloudFlare
- **Version Control:** Git, GitHub
- **Development Environment:** VS Code

## Key Implementations

1. **Dynamic Project Management:**
   - CRUD operations for projects via the admin panel.
   - Real-time updates of project information on the frontend.

2. **Skills Visualization:**
   - Interactive chart displaying skills and proficiency levels.
   - Editable through the admin panel.

3. **Admin Dashboard:**
   - Comprehensive overview of site statistics.
   - Management interfaces for projects, skills, and messages.

4. **Inbox System:**
   - Real-time notifications for new messages.
   - Interface for reading, marking as read/unread, and deleting messages.

5. **View Tracking:**
   - Tracks overall portfolio views and individual project views.
   - Displays statistics in the admin dashboard.

6. **Animations and Transitions:**
   - Utilized Framer Motion for smooth, engaging UI interactions.
   - Custom animations for page transitions and element reveals.

## Documentation

### Project Structure

The project follows a typical MERN stack structure:

```
bonannidominic.me/
├── app/
│   ├── frontend/
│   │   ├── public/
│   │   └── src/
│   │       ├── assets/
│   │       ├── components/
│   │       ├── pages/
│   │       ├── hooks/
│   │       └── styles/
│   └── backend/
│       ├── models/
│       ├── routes/
│       └── middleware/
```

### Key Components

1. **Project Management (ProjectManagement.js)**
   - Location: `app/frontend/src/components/pages/dashboard/ProjectManagement.js`
   - Purpose: Manages CRUD operations for projects in the admin panel.
   - Key Features: Dynamic sorting, filtering, and real-time updates.

2. **Project Detail Page (ProjectDetail.js)**
   - Location: `app/frontend/src/pages/public/ProjectDetail.js`
   - Purpose: Displays detailed information about a specific project.
   - Key Features: Interactive tabs, media gallery, and animated UI elements.

3. **Portfolio Section (PortfolioSection.js)**
   - Location: `app/frontend/src/components/pages/home/PortfolioSection.js`
   - Purpose: Showcases featured projects on the home page.
   - Key Features: Responsive grid layout, project cards with hover effects.

4. **Welcome Component (Welcome.js)**
   - Location: `app/frontend/src/components/pages/home/Welcome.js`
   - Purpose: Introduces the user to the portfolio and displays key statistics.
   - Key Features: Animated counters, skill marquee, and call-to-action button.

### API Endpoints

- `GET /api/projects`: Retrieve all projects
- `POST /api/projects`: Create a new project
- `PUT /api/projects/:id`: Update a project
- `DELETE /api/projects/:id`: Delete a project
- `GET /api/views/total`: Get total view count
- `GET /api/views/project/:projectId`: Get view count for a specific project
- `GET /api/views`: Get all views
- `GET /api/skills`: Get all skills
- `POST /api/skills`: Create a new skill
- `PUT /api/skills/:id`: Update a skill
- `DELETE /api/skills/:id`: Delete a skill
- `GET /api/about`: Get about information
- `PUT /api/about`: Update about information
- `POST /api/contact`: Submit a contact form
- `GET /api/contact`: Get all contact messages
- `DELETE /api/contact/:id`: Delete a contact message

### Styling

The project uses Tailwind CSS for styling, with custom configurations in `tailwind.config.js`. Key custom classes are defined in `src/styles/index.css`.

## Deployment

The application is deployed on DigitalOcean using Nginx as a reverse proxy. The deployment process involves:

1. Building the React frontend
2. Setting up the Node.js backend
3. Configuring Nginx to serve the static frontend and proxy API requests to the backend
4. Setting up SSL certificates with CloudFlare

## Conclusion

This portfolio website represents not just a showcase of my technical skills, but also my approach to problem-solving, user experience design, and continuous learning. It's a living project that will continue to evolve as I grow as a developer.

Key features include:
- Fully responsive design with interactive UI elements
- Dynamic content management through a custom CMS
- Comprehensive project showcase with detailed information
- Secure admin panel for content updates and message management
- View tracking for portfolio and individual projects
- Contact form with backend integration
- Dark/Light mode toggle for user preference

The tech stack demonstrates proficiency in modern web development:
- Frontend: React.js, Tailwind CSS, Framer Motion
- Backend: Node.js, Express.js, MongoDB
- Additional: Axios, JWT, DigitalOcean, Nginx

## Future Plans

1. **Blog Feature:** Implement a blog section for sharing insights and updates.
2. **Enhanced Analytics:** Implement more detailed analytics for visitor interactions.
3. **Interactive Demos:** Add a section for live, interactive JavaScript demos.
4. **AI Integration:** Explore integrating AI-powered features, such as a chatbot for answering visitor queries.
5. **Collaborative Project Space:** Create a platform for visitors to propose and collaborate on open-source projects.

---

Thank you for exploring my portfolio project! Feel free to reach out if you have any questions or would like to discuss potential collaborations.
