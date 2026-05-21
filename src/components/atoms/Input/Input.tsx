import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, hint, leftIcon, rightIcon, required, id, ...props }, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className={cn("form-label", required && "form-label-required")}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10">{leftIcon}</span>}
        <input
          ref={ref}
          id={id}
          className={cn(
            "form-input w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5",
            "text-text-primary placeholder:text-text-muted",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "transition-all duration-200",
            leftIcon && "!pl-10",
            rightIcon && "!pr-10",
            error && "border-danger focus:ring-danger/50",
            className,
          )}
          {...props}
        />
        {rightIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted z-10">{rightIcon}</span>}
      </div>
      {hint && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
