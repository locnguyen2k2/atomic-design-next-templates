'use client';

import { Icon, type IconName } from '@/components/atoms/Icon';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  icon: IconName;
  label: string;
  color: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'violet';
  href?: string;
  onClick?: () => void;
}

export function QuickActionCard({
  icon,
  label,
  color,
  href,
  onClick,
}: QuickActionCardProps) {
  const content = (
    <>
      <div
        className={cn(
          'quick-action-icon w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110',
          `bg-${color}-dim text-${color}`
        )}
      >
        <Icon name={icon} size="lg" />
      </div>
      <span className="quick-action-label text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
        {label}
      </span>
    </>
  );

  const className = cn(
    'quick-action-card group flex flex-col items-center justify-center p-4 rounded-xl bg-bg-elevated border border-border hover:border-primary/50 hover:bg-bg-surface transition-all duration-300 cursor-pointer shadow-sm active:scale-95'
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}
