import { cn } from '@/lib/utils';
import { Icon } from '../Icon';
import type { IconName } from '@/types/icon';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ checked, onChange, disabled, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'perm-check w-6 h-6 rounded border border-border flex items-center justify-center',
        'transition-all duration-200 hover:border-primary',
        checked && 'checked bg-primary border-primary',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {checked && <Icon name="check" className="text-white text-xs" />}
    </button>
  );
}
