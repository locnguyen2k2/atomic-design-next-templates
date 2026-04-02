'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';
import type { Toast, ToastType } from '@/stores';

const iconMap: Record<ToastType, Parameters<typeof Icon>[0]['name']> = {
  success: 'circle-check',
  error: 'circle-xmark',
  warning: 'triangle-exclamation',
  info: 'circle-info',
};

export function Toast({ id, message, type, onDismiss, duration = 3200 }: Toast & { onDismiss: (id: string) => void; duration?: number }) {
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRemoving(true);
      setTimeout(() => onDismiss(id), 250);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      className={cn(
        'toast',
        `toast--${type}`,
        isRemoving && 'removing'
      )}
    >
      <Icon name={iconMap[type]} className="toast-icon" />
      <div className="toast-body">
        <p className="toast-message">{message}</p>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: { 
  toasts: Toast[]; 
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
