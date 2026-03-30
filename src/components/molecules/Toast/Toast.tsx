'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';
import type { Toast, ToastType } from '@/stores';

const iconMap: Record<ToastType, Parameters<typeof Icon>[0]['name']> = {
  success: 'check',
  error: 'xmark',
  warning: 'warning',
  info: 'info',
};

export function Toast({ id, message, type, onDismiss, duration = 3200 }: Toast & { onDismiss: (id: string) => void; duration?: number }) {
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRemoving(true);
      setTimeout(() => onDismiss(id), 260);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      className={cn(
        'toast flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
        'bg-bg-elevated border border-border animate-slide-in',
        `toast--${type}`,
        isRemoving && 'removing'
      )}
    >
      <Icon name={iconMap[type]} className={cn('toast-icon', `text-${type}`)} />
      <div className="toast-body">
        <p className="toast-message text-sm">{message}</p>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: { 
  toasts: Toast[]; 
  onDismiss: (id: string) => void;
}) {
  return (
    <div id="toastContainer" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
