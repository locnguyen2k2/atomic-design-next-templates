import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, required, children, ...props }, ref) => {
  return (
    <label ref={ref} className={cn("text-[10px] font-black text-text-muted uppercase tracking-widest", required && 'after:content-["*"] after:ml-0.5 after:text-primary', className)} {...props}>
      {children}
    </label>
  );
});

Label.displayName = "Label";
