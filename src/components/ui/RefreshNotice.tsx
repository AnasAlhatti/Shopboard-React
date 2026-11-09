'use client';
import { useState } from 'react';
import { Button } from './Button';
export interface RefreshNoticeProps {
  error: unknown;
  onRefresh: () => Promise<unknown>;
}
export function RefreshNotice({ error, onRefresh }: RefreshNoticeProps) {
  const [pending, setPending] = useState(false);
  async function refresh() {
    setPending(true);
    try {
      await onRefresh();
    } catch {
      /* Existing results remain available; the hook exposes the error. */
    } finally {
      setPending(false);
    }
  }
  let label = 'Refresh products';
  if (pending) label = 'Refreshing…';
  else if (error) label = 'Try refresh again';
  return (
    <div className="my-4 flex flex-wrap items-center justify-between gap-3">
      {Boolean(error) && (
        <p role="status" className="m-0 text-sm text-destructive">
          Could not refresh products. Showing the last available results.
        </p>
      )}
      <Button variant="ghost" size="sm" onClick={refresh} disabled={pending}>
        {label}
      </Button>
    </div>
  );
}
