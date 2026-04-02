'use client';

import { useEffect, useRef } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { Badge } from '@/components/atoms/Badge';
import { cn } from '@/lib/utils';
import type { IconName } from '@/types/icon';

interface StatCardProps {
  icon: IconName;
  label: string;
  value: string | number;
  color: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'violet';
  percentage: number;
  hint: string;
  className?: string;
}

export function StatCard({ 
  icon, 
  label, 
  value, 
  color, 
  percentage, 
  hint, 
  className 
}: StatCardProps) {
  const barFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (barFillRef.current) {
        barFillRef.current.style.width = `${percentage}%`;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={cn('stat-card animate-fade-up', className)}>
      <div className="stat-card-header">
        <div className={cn('stat-card-icon', `stat-card-icon--${color}`)}>
          <Icon name={icon} />
        </div>
        <span className="stat-card-trend stat-card-trend--up">
          <Icon name="trend-up" size="sm" /> {hint}
        </span>
      </div>
      
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      
      <div className="stat-card-bar">
        <div 
          ref={barFillRef}
          className="stat-card-bar-fill" 
          style={{ width: 0 }}
          data-w={percentage}
        />
      </div>
    </div>
  );
}
