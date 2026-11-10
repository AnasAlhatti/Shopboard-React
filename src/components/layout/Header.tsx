'use client';
import { Menu, Scale, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../../features/cart/hooks/useCart';
import { useCompare } from '../../features/compare/hooks/useCompare';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { BrandLockup } from '../ui/BrandLockup';
import { NavigationLink as NavLink } from './NavigationLink';

interface HeaderProps {
  onOpenCart: () => void;
}

const navigation = [
  { label: 'Ecosystem', to: '/' },
  { label: 'Catalog', to: '/products' },
  { label: 'Unique Items', to: '/products?collection=unique' },
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
    <header className="sticky top-0 pt-safe z-10 border-b border-foreground/5 bg-surface backdrop-blur-md">
      <div className="grid w-shell max-w-page min-h-18 grid-cols-mobile-navigation items-center gap-1 mx-auto xl:grid-cols-navigation xl:gap-8">
        <Link
          className="inline-flex w-fit items-center gap-2 text-foreground text-xs font-extrabold tracking-widest no-underline whitespace-nowrap sm:gap-2.5 sm:text-sm"
          href="/"
          aria-label="AETHEL SILICON"
          onClick={closeMenu}
        >
          <BrandLockup />
        </Link>

        <Button
          variant="ghost"
          className="inline-grid w-10 h-10 flex-none place-items-center border border-border rounded-lg bg-surface text-foreground transition motion-reduce:transition-none duration-150 hover:border-primary/45 hover:text-primary  motion-safe:enabled:active:duration-150 motion-reduce:duration-150 col-start-3 row-start-1 justify-self-end xl:hidden"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>

        <nav
          id="primary-navigation"
          className={cn(
            `hidden col-span-full row-start-2 gap-1 pt-0 pb-3 xl:flex xl:col-span-1 xl:col-start-2 xl:row-start-1 xl:flex-row xl:justify-center xl:gap-0.5 xl:p-0${menuOpen ? ' flex flex-col xl:flex xl:col-span-1 xl:col-start-2 xl:row-start-1 xl:flex-row xl:justify-center xl:gap-0.5 xl:p-0' : ''}`,
          )}
          aria-label="Main navigation"
        >
          {navigation.map(({ label, to }) => (
            <NavLink
              key={to}
              href={to}
              end={to === '/'}
              className={({ isActive }) =>
                `py-2.5 px-3 rounded-lg text-muted text-xs no-underline transition duration-200 motion-reduce:transition-none duration-150 hover:bg-foreground/5 hover:text-foreground motion-reduce:duration-150${isActive ? ' bg-primary/15 text-foreground' : ''}`
              }
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex col-start-2 row-start-1 items-center gap-1 xl:col-start-3 xl:row-start-1 xl:gap-2.5">
          <ThemeToggle />
          <span
            className="min-h-10 items-center gap-1.5 py-2 px-2 border border-border rounded-lg bg-surface text-muted text-2xs font-bold tracking-wide hidden sm:inline-flex xl:gap-2 xl:px-3"
            aria-label="Compare item count"
          >
            <Scale size={16} aria-hidden="true" />
            <span aria-hidden="true" className="hidden xl:inline">
              COMPARE
            </span>
            <span className="grid min-w-5 h-5 place-items-center rounded-full bg-primary/15 text-primary tabular-nums motion-safe:animate-pulse motion-reduce:animate-none">
              {comparedItems.length}
            </span>
          </span>
          <Button
            variant="ghost"
            className="inline-flex min-h-10 items-center gap-1.5 py-2 px-2 border rounded-lg bg-surface text-2xs font-bold border-primary/30 text-foreground cursor-pointer tracking-normal xl:gap-2 xl:px-3  motion-safe:enabled:active:duration-150 motion-reduce:duration-150"
            type="button"
            aria-label={`Open quick cart, ${itemCount} items`}
            onClick={onOpenCart}
          >
            <ShoppingBag size={18} strokeWidth={1.8} aria-hidden="true" />
            <span className="hidden xl:inline">Quick cart</span>
            <span
              className="grid min-w-5 h-5 place-items-center rounded-full bg-primary/15 text-primary tabular-nums"
              aria-label="Cart item count"
              aria-live="polite"
            >
              {itemCount}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
