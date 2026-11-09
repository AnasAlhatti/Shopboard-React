export interface LoadingStateProps {
  label?: string;
}
export function LoadingState({ label = 'Loading page…' }: LoadingStateProps) {
  return (
    <div className="p-8 text-muted" role="status" aria-live="polite">
      <span
        className="inline-block w-6 h-6 border-2 border-border border-t-primary rounded-full motion-safe:animate-spin"
        aria-hidden="true"
      />
      <p>{label}</p>
    </div>
  );
}
