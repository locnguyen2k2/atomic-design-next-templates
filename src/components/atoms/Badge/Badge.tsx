import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium text-xs px-2.5 py-1 rounded-full',
  {
    variants: {
      variant: {
        primary: 'bg-primary-dim text-primary',
        success: 'bg-success-dim text-success',
        warning: 'bg-warning-dim text-warning',
        danger: 'bg-danger-dim text-danger',
        violet: 'bg-violet-dim text-violet',
        accent: 'bg-accent-dim text-accent',
        muted: 'bg-bg-surface text-text-muted border border-border',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {dot && <span className="status-dot status-dot--active" />}
      {children}
    </span>
  );
}
