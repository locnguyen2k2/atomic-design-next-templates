'use client';

import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { SearchForm } from '@/components/molecules/SearchForm';
import Link from 'next/link';

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
}

export function Header({ breadcrumb, theme, onThemeToggle, onSearch, user }: HeaderProps) {
  return (
    <header className="header fixed top-0 right-0 left-0 h-16 bg-bg-elevated border-b border-border z-30 ml-[260px]">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-bg-surface">
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
            placeholder="Search... (⌘K)"
            onSearch={onSearch}
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onThemeToggle}>
            <Icon name={theme === 'dark' ? 'moon' : 'sun'} />
          </Button>
          
          <Link href="/profile" className="flex items-center gap-2">
            <Avatar initials={`${user.first_name[0]}${user.last_name[0]}`} size="sm" />
            <span className="hidden lg:block text-sm">{user.first_name}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
