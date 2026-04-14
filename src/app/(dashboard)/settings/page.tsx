'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores';
import { DashboardLayout } from '@/components/templates/DashboardLayout/DashboardLayout';
import { Icon } from '@/components/atoms/Icon';

export default function SettingsPage() {
  const addToast = useAppStore((state) => state.addToast);

  useEffect(() => {
    addToast({
      message: 'Settings page coming soon!',
      type: 'info',
    });
  }, [addToast]);

  return (
    <DashboardLayout breadcrumb={[{ label: 'Settings' }]}>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <Icon name="settings" className="w-16 h-16 mx-auto text-text-muted" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-3">Settings</h1>
          <p className="text-text-muted mb-6">
            The settings page is currently under development. We're working hard to bring you comprehensive configuration options for your account and organization.
          </p>
          <div className="bg-bg-surface rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-text-primary mb-2">Coming Soon:</h3>
            <ul className="text-sm text-text-muted space-y-1">
              <li>Account preferences</li>
              <li>Notification settings</li>
              <li>Security configurations</li>
              <li>Organization settings</li>
              <li>Theme customization</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
