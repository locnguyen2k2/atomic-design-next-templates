import { cn } from '@/lib/utils';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'gradient';
  className?: string;
}

export function Avatar({ initials, size = 'md', color = 'gradient', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'avatar flex items-center justify-center rounded-lg font-semibold',
        {
          'w-8 h-8 text-xs': size === 'sm',
          'w-10 h-10 text-sm': size === 'md',
          'w-12 h-12 text-base': size === 'lg',
          'bg-gradient-to-br from-accent to-primary': color === 'gradient',
          'bg-primary-dim text-primary': color === 'primary',
          'bg-accent-dim text-accent': color === 'accent',
        },
        className
      )}
    >
      {initials.substring(0, 2).toUpperCase()}
    </div>
  );
}
