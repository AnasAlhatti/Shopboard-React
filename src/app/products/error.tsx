'use client';
import { useEffect, useEffectEvent, useRef, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '../../components/ui/Button';
export interface ProductErrorProps {
  error: unknown;
  retry: () => void;
}
export default function ProductError({ retry }: ProductErrorProps) {
  const collection = useSearchParams().get('collection') ?? 'hardware';
  const previousCollection = useRef(collection);
  const recoverCollection = useEffectEvent(retry);
  useEffect(() => {
    // Next keeps this route boundary mounted when only query parameters change.
    // Recover its external error state when the user selects another collection.
    if (previousCollection.current !== collection) {
      previousCollection.current = collection;
      recoverCollection();
    }
  }, [collection]);
  const [pending, startTransition] = useTransition();
  return (
    <section role="alert" className="mx-auto w-shell max-w-page py-12">
      <h1 className="text-2xl">We couldn’t load these products.</h1>
      <p>The other collection and the rest of the store are still available.</p>
      <Button
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            retry();
          })
        }
      >
        {pending ? 'Retrying…' : 'Try again'}
      </Button>
    </section>
  );
}
