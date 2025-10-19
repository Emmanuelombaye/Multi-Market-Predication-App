import React from 'react';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A comprehensive e-commerce solution with user authentication, payment processing, inventory management, and admin dashboard. Built with modern web technologies and following best practices for scalability and security.",
      image: "Project Screenshot",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe", "JWT"],
      liveUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, team collaboration features, drag-and-drop interface, and advanced filtering options.",
      image: "Project Screenshot",
      technologies: ["Vue.js", "Express", "Socket.io", "PostgreSQL", "Redis"],
      liveUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "A responsive weather dashboard displaying current conditions, 7-day forecasts, interactive maps, and location-based weather alerts using multiple weather APIs.",
      image: "Project Screenshot",
      technologies: ["React", "Chart.js", "OpenWeather API", "CSS3", "Responsive Design"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 4,
      title: "Social Media Analytics",
      description: "A comprehensive analytics platform for social media managers to track engagement, analyze performance metrics, and generate detailed reports across multiple platforms.",
      image: "Project Screenshot",
      technologies: ["React", "D3.js", "Python", "Django", "PostgreSQL", "Celery"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 5,
      title: "Real Estate Portal",
      description: "A full-featured real estate platform with property listings, advanced search filters, virtual tours, mortgage calculator, and agent management system.",
      image: "Project Screenshot",
      technologies: ["Next.js", "Node.js", "MongoDB", "Cloudinary", "Mapbox", "Stripe"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 6,
      title: "Learning Management System",
      description: "An educational platform with course management, video streaming, quizzes, progress tracking, and certificate generation for online learning.",
      image: "Project Screenshot",
      technologies: ["React", "Express", "MongoDB", "AWS S3", "FFmpeg", "PDF.js"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false
    }
  ];

  return (
    <div>
      <section className="section" style={{ paddingTop: '120px' }}>
        <div className="container">
          <h1 className="section-title">My Projects</h1>
          <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Here are some of the projects I've worked on. Each project represents a unique challenge 
            and an opportunity to learn and grow as a developer.
          </p>
          
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  {project.image}
                </div>
                <div className="project-content">
                  <h3 className="project-title">
                    {project.title}
                    {project.featured && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', background: '#28a745', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '10px' }}>Featured</span>}
                  </h3>
                  <p className="project-description">
                    {project.description}
                  </p>
                  <div className="project-tech">
                    {project.technologies.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a href={project.liveUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                    <a href={project.githubUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Technologies I Work With</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ marginBottom: '2rem', color: '#666', fontSize: '1.1rem' }}>
              I'm constantly learning and adapting to new technologies. Here are some of the 
              tools and technologies I use to bring ideas to life:
            </p>
            <div className="skills" style={{ justifyContent: 'center' }}>
              <span className="skill-tag">React</span>
              <span className="skill-tag">Vue.js</span>
              <span className="skill-tag">Angular</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">TypeScript</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">Python</span>
              <span className="skill-tag">Django</span>
              <span className="skill-tag">Express</span>
              <span className="skill-tag">MongoDB</span>
              <span className="skill-tag">PostgreSQL</span>
              <span className="skill-tag">AWS</span>
              <span className="skill-tag">Docker</span>
              <span className="skill-tag">Git</span>
              <span className="skill-tag">Figma</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;