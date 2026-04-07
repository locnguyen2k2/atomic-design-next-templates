'use client';

import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const breadcrumb = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'NexusIAM', href: '/dashboard' }];

    segments.forEach((segment, index) => {
      if (segment.startsWith('(') && segment.endsWith(')')) return;
      
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      crumbs.push({ label, href });
    });

    return crumbs;
  }, [pathname]);

  return (
    <DashboardLayout breadcrumb={breadcrumb}>
      {children}
    </DashboardLayout>
  );
}
