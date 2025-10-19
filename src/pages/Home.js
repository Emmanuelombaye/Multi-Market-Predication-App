import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Hi, I'm Your Name</h1>
          <p>Full Stack Developer & UI/UX Designer</p>
          <div className="hero-buttons">
            <Link to="/projects" className="btn">
              View My Work
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-image">
              Profile Image
            </div>
            <div className="about-text">
              <h3>Passionate Developer</h3>
              <p>
                I'm a creative developer with a passion for building beautiful, 
                functional, and user-centered digital experiences. With expertise 
                in modern web technologies, I love turning complex problems into 
                simple, elegant solutions.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, 
                contributing to open source projects, or sharing knowledge with 
                the developer community.
              </p>
              <div className="skills">
                <span className="skill-tag">React</span>
                <span className="skill-tag">JavaScript</span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">Python</span>
                <span className="skill-tag">UI/UX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            <div className="project-card">
              <div className="project-image">Project Screenshot</div>
              <div className="project-content">
                <h3 className="project-title">E-Commerce Platform</h3>
                <p className="project-description">
                  A full-stack e-commerce solution built with React and Node.js, 
                  featuring user authentication, payment processing, and admin dashboard.
                </p>
                <div className="project-tech">
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">Node.js</span>
                  <span className="tech-tag">MongoDB</span>
                  <span className="tech-tag">Stripe</span>
                </div>
                <div className="project-links">
                  <a href="#" className="project-link">Live Demo</a>
                  <a href="#" className="project-link">GitHub</a>
                </div>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image">Project Screenshot</div>
              <div className="project-content">
                <h3 className="project-title">Task Management App</h3>
                <p className="project-description">
                  A collaborative task management application with real-time updates, 
                  team collaboration features, and intuitive drag-and-drop interface.
                </p>
                <div className="project-tech">
                  <span className="tech-tag">Vue.js</span>
                  <span className="tech-tag">Express</span>
                  <span className="tech-tag">Socket.io</span>
                  <span className="tech-tag">PostgreSQL</span>
                </div>
                <div className="project-links">
                  <a href="#" className="project-link">Live Demo</a>
                  <a href="#" className="project-link">GitHub</a>
                </div>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image">Project Screenshot</div>
              <div className="project-content">
                <h3 className="project-title">Weather Dashboard</h3>
                <p className="project-description">
                  A responsive weather dashboard that displays current conditions, 
                  forecasts, and interactive maps using weather APIs.
                </p>
                <div className="project-tech">
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">Chart.js</span>
                  <span className="tech-tag">API</span>
                  <span className="tech-tag">CSS3</span>
                </div>
                <div className="project-links">
                  <a href="#" className="project-link">Live Demo</a>
                  <a href="#" className="project-link">GitHub</a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/projects" className="btn">
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;