"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LoginForm, RegisterForm, ResendEmailConfirmationForm } from "@/components/organisms";

interface AuthTemplateProps {
  // children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthTemplate({ title, subtitle }: AuthTemplateProps) {
  const [isRotate, setIsRotate] = React.useState(0)
  const [isEffected, setIsEfected] = React.useState(false);
  const [effectedForm, setEffectedFrom] = useState(1);

  const handleRotate = () => {
    setIsEfected(true);
    setIsRotate(isRotate > -270 ? isRotate - 90 : 0)
    setEffectedFrom(effectedForm < 4 ? effectedForm + 1 : 1)
  }

  useEffect(() => {
    if (isEffected)
      setTimeout(() => setIsEfected(false), 675)
  }, [isEffected]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base p-4 auth-template">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">{title}</h1>
          {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
        </div>

        <div className={cn("")} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div className="relative inline-flex items-center justify-center w-16 h-16 bg-bg-elevated rounded-2xl mb-7 shadow-xl shadow-primary/5"
            onClick={handleRotate}
            style={{
              borderRadius: 100,
              pointerEvents: isEffected ? "none" : "all",
              transform: `rotate(${isRotate}deg)`,
              transition: "ease-in-out 675ms",
              transitionProperty: "transform",
            }}>
            <svg className={`w-7 h-7 text-primary icon top ${effectedForm === 1}`} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"
              style={{
                transform: `translateY(50%) rotate(${-isRotate}deg)`,
              }}
            >
              <path d="M4 21C4 17.134 7.13401 14 11 14M18.5 20.2361C17.9692 20.7111 17.2684 21 16.5 21C14.8431 21 13.5 19.6569 13.5 18C13.5 16.3431 14.8431 15 16.5 15C17.8062 15 18.9175 15.8348 19.3293 17M20 14.5V17.5H17M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className={`w-7 h-7 text-primary icon left ${effectedForm === 4}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
              transform: `translateX(50%) rotate(${-isRotate}deg)`,
            }}>
              <path xmlns="http://www.w3.org/2000/svg" d="M4 21C4 17.4735 6.60771 14.5561 10 14.0709M19.8726 15.2038C19.8044 15.2079 19.7357 15.21 19.6667 15.21C18.6422 15.21 17.7077 14.7524 17 14C16.2923 14.7524 15.3578 15.2099 14.3333 15.2099C14.2643 15.2099 14.1956 15.2078 14.1274 15.2037C14.0442 15.5853 14 15.9855 14 16.3979C14 18.6121 15.2748 20.4725 17 21C18.7252 20.4725 20 18.6121 20 16.3979C20 15.9855 19.9558 15.5853 19.8726 15.2038ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className={`w-7 h-7 text-primary icon right ${effectedForm === 2}`} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none" style={{
              transform: `translateX(-50%) rotate(${-isRotate}deg)`,
            }}>
              <path xmlns="http://www.w3.org/2000/svg" d="M20 18L14 18M17 15V21M4 21C4 17.134 7.13401 14 11 14C11.695 14 12.3663 14.1013 13 14.2899M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className={`w-7 h-7 text-primary icon bottom ${effectedForm === 3}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
              transform: `translateY(-50%) rotate(${-isRotate}deg)`,
            }}>
              <path xmlns="http://www.w3.org/2000/svg" d="M14.9999 15.2547C13.8661 14.4638 12.4872 14 10.9999 14C7.40399 14 4.44136 16.7114 4.04498 20.2013C4.01693 20.4483 4.0029 20.5718 4.05221 20.6911C4.09256 20.7886 4.1799 20.8864 4.2723 20.9375C4.38522 21 4.52346 21 4.79992 21H9.94465M13.9999 19.2857L15.7999 21L19.9999 17M14.9999 7C14.9999 9.20914 13.2091 11 10.9999 11C8.79078 11 6.99992 9.20914 6.99992 7C6.99992 4.79086 8.79078 3 10.9999 3C13.2091 3 14.9999 4.79086 14.9999 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="container">
            <div className="light-effect"></div>
            <div className="light-text-effect">Login</div>
            <LoginForm effectedForm={effectedForm} />
            <RegisterForm effectedForm={effectedForm} />
            <ResendEmailConfirmationForm effectedForm={effectedForm} />
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-text-muted text-sm">&copy; {new Date().getFullYear()} Cjool Admin Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
