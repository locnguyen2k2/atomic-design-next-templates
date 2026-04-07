'use client';

import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { SearchForm } from '@/components/molecules/SearchForm';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

interface User {
  first_name: string;
  last_name: string;
}

interface HeaderProps {
  breadcrumb: { label: string; href?: string }[];
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onSearch: (query: string) => void;
  user: User;
  onMobileToggle?: () => void;
  onSidebarToggle?: () => void;
  sidebarCollapsed?: boolean;
}

export function Header({ breadcrumb, theme, onThemeToggle, onSearch, user, onMobileToggle, onSidebarToggle, sidebarCollapsed }: HeaderProps) {
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className={`header fixed top-0 right-0 left-0 h-16 bg-bg-elevated border-b border-border z-30 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'}`}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Sidebar Toggle + Breadcrumb */}
        <div className="flex items-center gap-4">
          {/* <button 
            onClick={onSidebarToggle}
            className="header-sidebar-toggle hidden lg:flex w-9 h-9 bg-transparent border-none rounded-lg items-center justify-center transition-all duration-200 hover:bg-bg-surface hover:scale-105 text-text-primary"
          >
            <Icon name="menu" />
          </button>
           */}
          <button 
            onClick={onMobileToggle}
            className="lg:hidden w-9 h-9 bg-transparent border-none rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-bg-surface hover:scale-105"
          >
            <Icon name="menu" />
          </button>
          
          <nav className="breadcrumb flex items-center gap-2 text-sm">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <Icon name="chevron-right" size="sm" className="text-text-muted" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-text-muted hover:text-text-primary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-text-primary font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Center: Global Search */}
        <div className="hidden md:block w-80">
          <SearchForm
            id="globalSearch"
            placeholder="Search... (⌘K)"
            onSearch={onSearch}
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onThemeToggle}>
            <Icon name={theme === 'dark' ? 'moon' : 'sun'} />
          </Button>
          
          <Link href="/profile" className="flex items-center gap-2 mr-2">
            <Avatar initials={`${user.first_name[0]}${user.last_name[0]}`} size="sm" />
            <span className="hidden lg:block text-sm">{user.first_name}</span>
          </Link>

          <Button variant="ghost" size="sm" onClick={() => logout()} className="text-danger hover:text-danger hover:bg-danger/10">
            <Icon name="logout" />
          </Button>
        </div>
      </div>
    </header>
  );
}
