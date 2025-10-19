import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="page home">
      <h1>Hi, I'm Your Name</h1>
      <p>Frontend Developer • React • TypeScript • UI/UX</p>
      <div className="cta-group">
        <Link className="btn primary" to="/projects">View Projects</Link>
        <Link className="btn" to="/contact">Contact Me</Link>
      </div>
    </section>
  );
}
