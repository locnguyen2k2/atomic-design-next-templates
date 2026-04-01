'use client';

import { Input } from '@/components/atoms/Input';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';
import type { IconName } from '@/types/icon';

interface FormFieldProps {
  name?: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: IconName;
  readOnly?: boolean;
  children?: React.ReactNode; 
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  required,
  disabled,
  icon,
  readOnly,
   children,
}: FormFieldProps) {
  return (
    <div className="form-group">
      <label className={cn('form-label', required && 'form-label-required')}>
        {label}
      </label>
      {children || ( // Render children if provided, otherwise render default Input
        <div className="form-input-icon-wrapper">
          {icon && (
            <Icon name={icon} className="form-input-icon" />
          )}
          <Input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            error={error}
            disabled={disabled}
            readOnly={readOnly}
            className={cn(icon && 'pl-10', readOnly && 'readonly')}
          />
        </div>
      )}
      {hint && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error text-danger text-xs">{error}</span>}
    </div>
  );
}
