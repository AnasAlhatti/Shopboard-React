import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="route-placeholder page-width">
      <p className="eyebrow">404 / Page not found</p>
      <h1>This page doesn’t exist.</h1>
      <p>Check the address or return to the product catalogue.</p>
      <Link className="button button--primary" to="/catalog">
        Browse products
      </Link>
    </main>
  );
}
