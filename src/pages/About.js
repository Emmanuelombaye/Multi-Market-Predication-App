import React from 'react';

const About = () => {
  return (
    <div>
      <section className="section" style={{ paddingTop: '120px' }}>
        <div className="container">
          <h1 className="section-title">About Me</h1>
          <div className="about-content">
            <div className="about-image">
              Profile Image
            </div>
            <div className="about-text">
              <h3>Hello! I'm Your Name</h3>
              <p>
                I'm a passionate full-stack developer with over 5 years of experience 
                in creating digital solutions that make a difference. My journey in 
                technology started with curiosity and has evolved into a deep love 
                for building applications that solve real-world problems.
              </p>
              <p>
                I specialize in modern web technologies and have a strong foundation 
                in both frontend and backend development. I believe in writing clean, 
                maintainable code and following best practices to deliver high-quality 
                solutions.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, 
                contributing to open source projects, or sharing knowledge with 
                the developer community through blog posts and mentoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Skills & Technologies</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Frontend Development</h3>
              <div className="skills">
                <span className="skill-tag">React</span>
                <span className="skill-tag">Vue.js</span>
                <span className="skill-tag">Angular</span>
                <span className="skill-tag">JavaScript</span>
                <span className="skill-tag">TypeScript</span>
                <span className="skill-tag">HTML5</span>
                <span className="skill-tag">CSS3</span>
                <span className="skill-tag">Sass</span>
                <span className="skill-tag">Tailwind CSS</span>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Backend Development</h3>
              <div className="skills">
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">Express</span>
                <span className="skill-tag">Python</span>
                <span className="skill-tag">Django</span>
                <span className="skill-tag">Flask</span>
                <span className="skill-tag">PHP</span>
                <span className="skill-tag">Laravel</span>
                <span className="skill-tag">REST APIs</span>
                <span className="skill-tag">GraphQL</span>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Databases</h3>
              <div className="skills">
                <span className="skill-tag">MongoDB</span>
                <span className="skill-tag">PostgreSQL</span>
                <span className="skill-tag">MySQL</span>
                <span className="skill-tag">Redis</span>
                <span className="skill-tag">Firebase</span>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Tools & Others</h3>
              <div className="skills">
                <span className="skill-tag">Git</span>
                <span className="skill-tag">Docker</span>
                <span className="skill-tag">AWS</span>
                <span className="skill-tag">Heroku</span>
                <span className="skill-tag">Figma</span>
                <span className="skill-tag">Adobe XD</span>
                <span className="skill-tag">Jest</span>
                <span className="skill-tag">Webpack</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Senior Full Stack Developer</h3>
              <p style={{ color: '#007bff', marginBottom: '0.5rem' }}>Tech Company • 2022 - Present</p>
              <p style={{ color: '#666' }}>
                Leading development of scalable web applications, mentoring junior developers, 
                and implementing best practices for code quality and performance optimization.
              </p>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Full Stack Developer</h3>
              <p style={{ color: '#007bff', marginBottom: '0.5rem' }}>Digital Agency • 2020 - 2022</p>
              <p style={{ color: '#666' }}>
                Developed and maintained multiple client projects, collaborated with design teams, 
                and delivered high-quality solutions within tight deadlines.
              </p>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Frontend Developer</h3>
              <p style={{ color: '#007bff', marginBottom: '0.5rem' }}>Startup Company • 2019 - 2020</p>
              <p style={{ color: '#666' }}>
                Focused on creating responsive and interactive user interfaces, 
                working closely with UX designers to implement pixel-perfect designs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;