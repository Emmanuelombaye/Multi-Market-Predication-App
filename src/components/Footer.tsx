export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>© {year} My Portfolio. All rights reserved.</p>
      </div>
    </footer>
  );
}
