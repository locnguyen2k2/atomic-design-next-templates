'use client';

import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';
import { useAppStore } from '@/stores';
import { useEffect, useState } from 'react';

interface Organization {
  id: string;
  name: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumb: { label: string; href?: string }[];
}

export function DashboardLayout({ children, breadcrumb }: DashboardLayoutProps) {
  const { theme, toggleTheme, sidebarCollapsed, toggleSidebar, currentOrg, setCurrentOrg } = useAppStore();
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: '1', name: 'Acme Corp' },
    { id: '2', name: 'TechStart Inc' },
    { id: '3', name: 'Global Solutions' },
  ]);

  const [currentOrgData, setCurrentOrgData] = useState<Organization>(organizations[0]);

  useEffect(() => {
    if (currentOrg) {
      const org = organizations.find(o => o.id === currentOrg);
      if (org) setCurrentOrgData(org);
    }
  }, [currentOrg, organizations]);

  const handleOrgSwitch = (orgId: string) => {
    setCurrentOrg(orgId);
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  const user = {
    first_name: 'John',
    last_name: 'Doe',
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentOrg={currentOrgData}
        organizations={organizations}
        onOrgSwitch={handleOrgSwitch}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'
        }`}
      >
        <Header
          breadcrumb={breadcrumb}
          theme={theme}
          onThemeToggle={toggleTheme}
          onSearch={handleSearch}
          user={user}
        />
        <main className="pt-16 p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
