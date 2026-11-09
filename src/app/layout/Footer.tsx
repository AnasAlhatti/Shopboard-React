import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <Link className="site-footer__brand" to="/">
        AETHEL SILICON
      </Link>
      <p>Forged for Extreme Compute.</p>
      <span>© {new Date().getFullYear()} Aethel Silicon</span>
    </footer>
  );
}
