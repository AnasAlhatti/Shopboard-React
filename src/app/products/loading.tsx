export default function Loading() {
  return (
    <main className="mx-auto w-shell max-w-page py-12" role="status">
      <p>Loading products…</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {['first', 'second', 'third', 'fourth', 'fifth', 'sixth'].map((id) => (
          <div
            key={id}
            className="h-80 rounded-card border border-border bg-surface motion-safe:animate-pulse"
            aria-hidden="true"
          />
        ))}
      </div>
    </main>
  );
}
