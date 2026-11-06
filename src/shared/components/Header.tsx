import { useState } from 'react';
import { Menu, Scale, ShoppingBag, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../features/cart/hooks/useCart';
import { useCompare } from '../../features/compare/hooks/useCompare';

interface HeaderProps {
  onOpenCart: () => void;
}

const navigation = [
  { label: 'Ecosystem', to: '/' },
  { label: 'Catalog', to: '/catalog' },
  { label: 'Benchmark Compare', to: '/compare' },
  { label: 'Rig Configurator', to: '/configurator' },
  { label: 'Cart', to: '/cart' },
];

export function Header({ onOpenCart }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { comparedItems } = useCompare();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand-mark" to="/" onClick={closeMenu}>
          <span className="brand-mark__symbol" aria-hidden="true">
            A
          </span>
          <span>AETHEL SILICON</span>
        </Link>

        <button
          className="icon-button menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav
          id="primary-navigation"
          className={`primary-nav${menuOpen ? ' primary-nav--open' : ''}`}
          aria-label="Main navigation"
        >
          {navigation.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `primary-nav__link${isActive ? ' is-active' : ''}`
              }
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <span className="status-badge" aria-label="Compare item count">
            <Scale size={16} aria-hidden="true" />
            <span aria-hidden="true">COMPARE</span>
            <span className="status-badge__count">{comparedItems.length}</span>
          </span>
          <button
            className="cart-trigger"
            type="button"
            aria-label={`Open quick cart, ${itemCount} items`}
            onClick={onOpenCart}
          >
            <ShoppingBag size={18} strokeWidth={1.8} aria-hidden="true" />
            <span>Quick cart</span>
            <span
              className="cart-trigger__count"
              aria-label="Cart item count"
              aria-live="polite"
            >
              {itemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
