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
  section: 'main' | 'iam' | 'account';
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid-2', href: '/dashboard', section: 'main' },
  { id: 'organizations', label: 'Organizations', icon: 'building', href: '/organizations', section: 'iam' },
  { id: 'projects', label: 'Projects', icon: 'folder-open', href: '/projects', section: 'iam' },
  { id: 'features', label: 'Features', icon: 'flag', href: '/features', section: 'iam' },
  { id: 'roles', label: 'Roles', icon: 'shield', href: '/roles', section: 'iam' },
  { id: 'permissions', label: 'Permissions', icon: 'key', href: '/permissions', section: 'iam' },
  { id: 'profile', label: 'Profile', icon: 'user', href: '/profile', section: 'account' },
  { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings', section: 'account' },
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
  user: {
    first_name: string;
    last_name: string;
    role?: string;
  };
}

export function Sidebar({
  currentOrg,
  organizations,
  onOrgSwitch,
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
  user,
}: SidebarProps) {
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'sidebar fixed left-0 top-0 h-full bg-bg-elevated border-r border-border z-50',
          'transition-all duration-300 ease-in-out overflow-x-hidden',
          collapsed ? 'lg:w-[68px]' : 'lg:w-[260px]',
          mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'
        )}
      >
      {/* Logo */}
      <div className="sidebar-header flex items-center gap-3 p-4 border-b border-border">
        {!collapsed && (
          <div className="logo flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-text-primary">NexusIAM</span>
              <span className="text-xs text-text-muted font-mono">v2.4.0</span>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-2 rounded-lg hover:bg-bg-surface transition-all duration-200 hover:scale-105"
        >
          <Icon name={collapsed ? 'menu' : 'x'} className="transition-transform duration-200 text-text-primary" />
        </button>
      </div>

      {/* Org Switcher */}
      <div className="org-switcher relative">
        <button
          onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
          className="org-switcher-inner flex items-center gap-2.5 w-full p-2 rounded-lg hover:bg-bg-surface transition-colors duration-200"
        >
          <Avatar initials={getInitials(currentOrg.name)} size="sm" />
          {!collapsed && (
            <>
              <div className="org-info flex-1 overflow-hidden">
                <span className="org-name block text-sm font-semibold text-text-primary truncate">{currentOrg.name}</span>
                <span className="org-label text-xs text-text-muted uppercase tracking-wide">Organization</span>
              </div>
              <Icon 
                name="chevron-down" 
                className={cn(
                  'org-chevron text-xs text-text-muted transition-transform duration-200',
                  orgDropdownOpen && 'rotate-180'
                )} 
              />
            </>
          )}
        </button>

        {orgDropdownOpen && !collapsed && (
         <div className="org-dropdown m-3 absolute top-[calc(100%+6px)] left-0 right-0 bg-bg-surface rounded-lg border border-border shadow-lg overflow-hidden z-[60] min-w-[200px]">
            <div className="org-dropdown-header text-xs font-semibold uppercase tracking-wide text-text-muted py-2.5 px-3.5 pb-1.5">
              Switch Organization
            </div>
            <div className="org-dropdown-list">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    onOrgSwitch(org.id);
                    setOrgDropdownOpen(false);
                  }}
                  className={cn(
                    'org-dropdown-item flex items-center gap-2.5 w-full p-2.5 hover:bg-bg-elevated transition-colors duration-200',
                    org.id === currentOrg.id && 'bg-primary-dim'
                  )}
                >
                  <Avatar initials={getInitials(org.name)} size="sm" />
                  <span className="org-dropdown-item-name text-xs font-medium text-text-primary">{org.name}</span>
                  {org.id === currentOrg.id && (
                    <Icon name="check" className="ml-auto text-primary text-xs" />
                  )}
                </button>
              ))}
            </div>
            <div className="org-dropdown-footer pt-1.5 px-2 pb-2 border-t border-border">
              <button 
                className="org-dropdown-create w-full py-1.5 px-2.5 bg-primary-dim text-primary rounded-md hover:bg-primary hover:text-white transition-all duration-200 text-xs font-medium flex items-center justify-center gap-1.5"
                onClick={() => {
                  setOrgDropdownOpen(false);
                }}
              >
                <Icon name="plus" className="text-xs" />
                New Organization
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav flex-1 p-3">
        {!collapsed && (
          <>
            <div className="nav-section-label text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Main</div>
            {navItems.filter(item => item.section === 'main').map((item) => (
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
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge !== undefined && (
                  <Badge variant="muted" className="text-xs">{item.badge}</Badge>
                )}
              </Link>
            ))}
            
            <div className="nav-section-label text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 mt-4">IAM</div>
            {navItems.filter(item => item.section === 'iam').map((item) => (
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
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge !== undefined && (
                  <Badge variant="muted" className="text-xs">{item.badge}</Badge>
                )}
              </Link>
            ))}
            
            <div className="nav-section-label text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 mt-4">Account</div>
            {navItems.filter(item => item.section === 'account').map((item) => (
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
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge !== undefined && (
                  <Badge variant="muted" className="text-xs">{item.badge}</Badge>
                )}
              </Link>
            ))}
          </>
        )}
        
        {collapsed && (
          navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'nav-item flex items-center justify-center px-3 py-2.5 rounded-lg mb-1',
                'text-text-secondary hover:text-text-primary hover:bg-bg-surface',
                'transition-colors duration-200',
                pathname === item.href && 'active bg-primary-dim text-primary'
              )}
            >
              <Icon name={item.icon} />
            </Link>
          ))
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer p-3 border-t border-border">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-surface"
        >
          <Avatar initials={getInitials(`${user.first_name} ${user.last_name}`)} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.first_name} {user.last_name}</div>
              <div className="text-xs text-text-muted truncate">{user.role || 'Member'}</div>
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
