'use client';

import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';
import { useAppStore } from '@/stores';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: '1', name: 'Acme Corp' },
    { id: '2', name: 'TechStart Inc' },
    { id: '3', name: 'Global Solutions' },
  ]);

  const [currentOrgData, setCurrentOrgData] = useState<Organization>(organizations[0]);

  useEffect(() => {
    // Close mobile sidebar on route change
    setMobileSidebarOpen(false);
  }, [breadcrumb]);

  useEffect(() => {
    if (currentOrg) {
      const org = organizations.find(o => o.id === currentOrg);
      if (org) setCurrentOrgData(org);
    }
  }, [currentOrg, organizations]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <div className="flex min-h-screen bg-bg transition-colors duration-300">
      <Sidebar
        currentOrg={currentOrgData}
        organizations={organizations}
        onOrgSwitch={handleOrgSwitch}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div
        className={cn(
          'flex-1 transition-all duration-300 min-w-0',
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        )}
      >
        <Header
          breadcrumb={breadcrumb}
          theme={theme}
          onThemeToggle={toggleTheme}
          onSearch={handleSearch}
          user={user}
          onMobileToggle={() => setMobileSidebarOpen(true)}
        />
        <main className="pt-16 p-4 sm:p-6 min-h-screen">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
