import React from "react";
import { cn } from "@/lib/utils";

interface AuthTemplateProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthTemplate({ children, title, subtitle }: AuthTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-bg-elevated border border-border rounded-2xl mb-4 shadow-xl shadow-primary/5">
            <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V12C3 18 12 22 12 22C12 22 21 18 21 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">{title}</h1>
          {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
        </div>

        <div className={cn("bg-bg-elevated rounded-3xl shadow-2xl", "backdrop-blur-sm bg-bg-elevated/80")}>{children}</div>

        <div className="text-center mt-8">
          <p className="text-text-muted text-sm">&copy; {new Date().getFullYear()} NexusIAM. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
