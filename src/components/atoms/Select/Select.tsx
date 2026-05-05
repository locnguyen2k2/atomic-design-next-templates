import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, label, error, hint, required, id, options, ...props }, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="text-[10px] font-black text-text-muted uppercase tracking-widest">
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </label>
      )}
      <div className="relative">
        <select ref={ref} id={id} className={cn("form-input w-full bg-secondary/30 border border-border/50 rounded-lg px-3 h-11 text-sm font-medium", "focus:outline-none focus:ring-1 focus:ring-primary appearance-none", error && "border-danger focus:ring-danger", className)} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {hint && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
});

Select.displayName = "Select";
