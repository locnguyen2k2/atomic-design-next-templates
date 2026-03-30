'use client';

import { useAppStore } from '@/stores';
import { ToastContainer } from '@/components/molecules/Toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toasts = useAppStore((state) => state.toasts);
  const dismissToast = useAppStore((state) => state.dismissToast);

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
