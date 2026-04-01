'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: Parameters<typeof Icon>[0]['name'];
  badge?: number;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'building', href: '/dashboard' },
  { id: 'organizations', label: 'Organizations', icon: 'building', href: '/organizations' },
  { id: 'projects', label: 'Projects', icon: 'folder-open', href: '/projects' },
  { id: 'features', label: 'Features', icon: 'flag', href: '/features' },
  { id: 'roles', label: 'Roles', icon: 'shield', href: '/roles' },
  { id: 'permissions', label: 'Permissions', icon: 'key', href: '/permissions' },
];

interface Organization {
  id: string;
  name: string;
}

interface SidebarProps {
  currentOrg: Organization;
  organizations: Organization[];
  onOrgSwitch: (orgId: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({
  currentOrg,
  organizations,
  onOrgSwitch,
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'sidebar fixed left-0 top-0 h-full bg-bg-elevated border-r border-border z-50',
          'transition-all duration-300 ease-in-out',
          // Desktop sizing
          collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]',
          // Mobile positioning
          mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'
        )}
      >
      {/* Logo */}
      <div className="sidebar-header flex items-center gap-3 p-4 border-b border-border">
        {!collapsed && (
          <div className="logo flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary" />
            <span className="font-bold text-lg">NexusIAM</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-2 rounded-lg hover:bg-bg-surface"
        >
          <Icon name="menu" />
        </button>
      </div>

      {/* Org Switcher */}
      <div className="org-switcher p-3">
        <button
          onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
          className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-bg-surface"
        >
          <Avatar initials={getInitials(currentOrg.name)} size="sm" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left text-sm truncate">{currentOrg.name}</span>
              <Icon name="chevron-right" className={cn('transition-transform', orgDropdownOpen && 'rotate-90')} />
            </>
          )}
        </button>

        {orgDropdownOpen && !collapsed && (
          <div className="org-dropdown mt-2 bg-bg-surface rounded-lg border border-border overflow-hidden">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => {
                  onOrgSwitch(org.id);
                  setOrgDropdownOpen(false);
                }}
                className={cn(
                  'flex items-center gap-3 w-full p-2 hover:bg-bg-elevated',
                  org.id === currentOrg.id && 'bg-primary-dim'
                )}
              >
                <Avatar initials={getInitials(org.name)} size="sm" />
                <span className="text-sm">{org.name}</span>
                {org.id === currentOrg.id && (
                  <Icon name="check" className="ml-auto text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav flex-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              'nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1',
              'text-text-secondary hover:text-text-primary hover:bg-bg-surface',
              'transition-colors duration-200',
              pathname === item.href && 'active bg-primary-dim text-primary'
            )}
          >
            <Icon name={item.icon} />
            {!collapsed && (
              <>
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge !== undefined && (
                  <Badge variant="muted" className="text-xs">{item.badge}</Badge>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer p-3 border-t border-border">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-surface"
        >
          <Avatar initials="JD" size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">John Doe</div>
              <div className="text-xs text-text-muted truncate">Super Admin</div>
            </div>
          )}
        </Link>
      </div>
    </aside>
    </>
  );
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}
