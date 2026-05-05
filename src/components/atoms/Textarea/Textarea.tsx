import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, hint, required, id, ...props }, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="text-[10px] font-black text-text-muted uppercase tracking-widest">
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </label>
      )}
      <textarea ref={ref} id={id} className={cn("form-input w-full bg-secondary/30 border border-border/50 rounded-lg p-3 text-sm font-medium", "focus:outline-none focus:ring-1 focus:ring-primary", error && "border-danger focus:ring-danger", className)} {...props} />
      {hint && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
});

Textarea.displayName = "Textarea";
