export function LoadingState({ label = 'Loading page…' }: { label?: string }) {
  return (
    <div className="async-state" role="status" aria-live="polite">
      <span className="loading-indicator" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
