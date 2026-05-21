"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Icon, LiquidGlass } from "@/components/atoms";
import { authApi } from "@/api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import type { CaptchaData } from "@/types";

export function ResendEmailConfirmationForm() {
  const router = useRouter();

  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchCaptcha = async () => {
    setIsRefreshingCaptcha(true);
    try {
      const response = await authApi.getCaptcha();
      setCaptchaData(response.data);
    } catch (err) {
      console.error("Failed to fetch captcha:", err);
    } finally {
      setIsRefreshingCaptcha(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaData) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authApi.resendEmailVerification({
        captcha_id: captchaData.captcha_id,
        captcha: captchaInput,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/email-confirmation");
      }, 2000);
    } catch (err: any) {
      console.error("Resend email verification error:", err);
      setError(err.response?.data?.message || "Failed to resend verification email");
      fetchCaptcha();
      setCaptchaInput("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <LiquidGlass blur={20} opacity={0.15} borderOpacity={0.3} shadowIntensity={0.15} className="p-6 rounded-2xl space-y-4">
        {error && <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center animate-shake">{error}</div>}
        {success && <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm text-center">Verification email sent successfully! Redirecting...</div>}

        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Resend Verification Email</h3>
          <p className="text-sm text-text-secondary mt-1">Enter the captcha to resend the confirmation email</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-12 bg-surface-secondary rounded-lg overflow-hidden border border-border flex items-center justify-center relative group">
              {captchaData ? <img src={captchaData.captcha} alt="Captcha" className="h-full w-full object-contain" /> : <div className="w-full h-full animate-pulse bg-muted/20" />}
              <button type="button" onClick={fetchCaptcha} disabled={isRefreshingCaptcha} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Icon name="refresh" className={isRefreshingCaptcha ? "animate-spin" : ""} />
              </button>
            </div>
            <div className="w-1/2">
              <Input id="captcha" placeholder="Captcha" type="text" required value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} leftIcon={<FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4" />} />
            </div>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full shadow-lg shadow-primary/20" loading={isLoading}>
          Resend Email
        </Button>

        <div className="text-center text-sm text-text-secondary">
          <button type="button" className="text-primary font-semibold hover:underline" onClick={() => router.push("/email-confirmation")}>
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-1" />
            Back to Confirmation
          </button>
        </div>
      </LiquidGlass>
    </form>
  );
}
