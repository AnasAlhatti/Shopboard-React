'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
const modal = cva(
  'm-auto max-h-dialog w-dialog overflow-y-auto overscroll-contain rounded-card border border-border bg-carbon p-6 text-foreground shadow-card backdrop:bg-black/70 backdrop:backdrop-blur-sm',
  {
    variants: {
      size: { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' },
      placement: {
        center: '',
        drawer:
          'mr-0 h-dvh max-h-dvh max-w-md rounded-none border-y-0 border-r-0',
      },
    },
    defaultVariants: { size: 'md', placement: 'center' },
  },
);

function containTabFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab') return;
  const dialog = event.currentTarget;
  const controls = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((control) => control.getClientRects().length > 0);
  const first = controls[0];
  const last = controls.at(-1);
  // Keep edge tabs in the dialog instead of moving focus into browser chrome.
  if (!first || (event.shiftKey && document.activeElement === first)) {
    event.preventDefault();
    (last ?? dialog).focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function isBackdropClick(event: MouseEvent<HTMLDialogElement>): boolean {
  if (event.target !== event.currentTarget) return false;
  const bounds = event.currentTarget.getBoundingClientRect();
  return (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  );
}
export interface ModalProps extends VariantProps<typeof modal> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  closeLabel?: string;
}
export function Modal({
  open,
  onClose,
  title,
  children,
  size,
  placement,
  className,
  closeLabel = 'Close dialog',
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [open]);
  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={cn(modal({ size, placement }), className)}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={containTabFocus}
      onClick={(event) => {
        if (isBackdropClick(event)) onClose();
      }}
    >
      <header className="mb-6 flex items-center justify-between gap-4">
        <h2 id={titleId} className="m-0 text-xl">
          {title}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label={closeLabel}
        >
          <X size={18} aria-hidden="true" />
        </Button>
      </header>
      {children}
    </dialog>
  );
}
