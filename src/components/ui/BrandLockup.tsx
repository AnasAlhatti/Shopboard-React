export function BrandLockup() {
  return (
    <span className="inline-flex items-center gap-2.5" aria-hidden="true">
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className="h-9 w-9 shrink-0 text-primary"
      >
        <path
          d="M12 4h16l8 8v16l-8 8H12l-8-8V12z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="m11 27 9-17 9 17h-6l-3-6-3 6z" fill="currentColor" />
        <path
          d="M1 16h6M1 24h6M33 16h6M33 24h6M16 1v6M24 1v6M16 33v6M24 33v6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <span className="flex flex-col text-foreground">
        <span className="text-2xl font-semibold leading-none tracking-tight">
          aethel<span className="text-primary">.</span>
        </span>
        <span className="mt-1 text-xs font-medium leading-none tracking-widest text-muted">
          SILICON
        </span>
      </span>
    </span>
  );
}
