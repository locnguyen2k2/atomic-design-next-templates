import { forwardRef, useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms/Icon';
import { Input } from '@/components/atoms/Input';

interface DateRangePickerProps {
  value?: { from?: Date; to?: Date };
  onChange?: (range: { from?: Date; to?: Date }) => void;
  placeholder?: { from?: string; to?: string };
  className?: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  ({ 
    value, 
    onChange, 
    placeholder = { from: 'Start date', to: 'End date' },
    className,
    label,
    error,
    hint,
    required,
    ...props 
  }, ref) => {
    const [fromDate, setFromDate] = useState(value?.from ? format(value.from, 'yyyy-MM-dd') : '');
    const [toDate, setToDate] = useState(value?.to ? format(value.to, 'yyyy-MM-dd') : '');

    const handleFromDateChange = (dateString: string) => {
      setFromDate(dateString);
      const from = dateString ? new Date(dateString) : undefined;
      onChange?.({ from, to: value?.to });
    };

    const handleToDateChange = (dateString: string) => {
      setToDate(dateString);
      const to = dateString ? new Date(dateString) : undefined;
      onChange?.({ from: value?.from, to });
    };

    return (
      <div ref={ref} className={cn('date-range-picker', className)} {...props}>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => handleFromDateChange(e.target.value)}
              placeholder={placeholder.from}
              error={error}
            />
          </div>
          <div className="flex items-center text-text-muted">
            <Icon name="chevron-right" className="mx-1" />
          </div>
          <div className="flex-1">
            <Input
              type="date"
              value={toDate}
              onChange={(e) => handleToDateChange(e.target.value)}
              placeholder={placeholder.to}
              min={fromDate}
            />
          </div>
        </div>
        {hint && <span className="form-hint">{hint}</span>}
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';
