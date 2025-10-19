import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <section className="section" style={{ paddingTop: '120px' }}>
        <div className="container">
          <h1 className="section-title">Get In Touch</h1>
          <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            I'm always interested in new opportunities and exciting projects. 
            Let's discuss how we can work together!
          </p>
          
          <div className="contact-content">
            <div className="contact-info">
              <h3>Let's Connect</h3>
              <p style={{ marginBottom: '2rem', color: '#666', lineHeight: '1.8' }}>
                Whether you have a project in mind, want to collaborate, or just want to say hello, 
                I'd love to hear from you. Feel free to reach out through any of the channels below.
              </p>
              
              <div className="contact-item">
                <span>📧</span>
                <span>your.email@example.com</span>
              </div>
              
              <div className="contact-item">
                <span>📱</span>
                <span>+1 (555) 123-4567</span>
              </div>
              
              <div className="contact-item">
                <span>📍</span>
                <span>Your City, Country</span>
              </div>
              
              <div className="contact-item">
                <span>💼</span>
                <span>Available for freelance work</span>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Follow Me</h4>
                <div className="social-links" style={{ justifyContent: 'flex-start' }}>
                  <a href="https://github.com" className="social-link" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                  <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                  <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                  <a href="https://dribbble.com" className="social-link" target="_blank" rel="noopener noreferrer">
                    Dribbble
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Send me a message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn" style={{ width: '100%' }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>What services do you offer?</h3>
              <p style={{ color: '#666' }}>
                I offer full-stack web development, UI/UX design, mobile app development, 
                and consulting services. I can help with everything from concept to deployment.
              </p>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>How long does a typical project take?</h3>
              <p style={{ color: '#666' }}>
                Project timelines vary depending on complexity and scope. A simple website might take 2-4 weeks, 
                while a complex web application could take 2-6 months. I'll provide a detailed timeline during our initial discussion.
              </p>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Do you work with clients remotely?</h3>
              <p style={{ color: '#666' }}>
                Yes! I work with clients from all over the world. I'm experienced in remote collaboration 
                and use various tools to ensure smooth communication and project management.
              </p>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>What's your availability?</h3>
              <p style={{ color: '#666' }}>
                I'm currently available for new projects and freelance work. I typically respond to inquiries 
                within 24 hours and can start new projects within 1-2 weeks depending on my current workload.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;