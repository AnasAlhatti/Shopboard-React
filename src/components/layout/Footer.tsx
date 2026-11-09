import Link from 'next/link';

export function Footer() {
  return (
    <footer className="flex w-shell max-w-page min-h-24 flex-wrap items-center justify-between gap-2 mt-auto mr-auto mb-0 ml-auto py-6 border-t border-foreground/10 text-muted text-xs md:flex-nowrap">
      <Link
        className="text-foreground font-extrabold tracking-widest no-underline"
        href="/"
      >
        AETHEL SILICON
      </Link>
      <p className="m-0 text-xs">Forged for Extreme Compute.</p>
      <span>© {new Date().getFullYear()} Aethel Silicon</span>
    </footer>
  );
}
