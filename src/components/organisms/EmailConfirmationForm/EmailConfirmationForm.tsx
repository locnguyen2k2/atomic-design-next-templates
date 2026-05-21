"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Icon, LiquidGlass } from "@/components/atoms";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faShieldAlt, faKey } from "@fortawesome/free-solid-svg-icons";
import type { CaptchaData } from "@/types";

export function EmailConfirmationForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [code, setCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const verifyToken = async () => {
      const accessToken = localStorage.getItem("nexusiam-token");
      if (!accessToken) {
        router.push("/login");
        return;
      }

      try {
        await authApi.verifyAccessToken(accessToken);
      } catch (error) {
        console.error("Invalid access token:", error);
        router.push("/login");
      }
    };

    verifyToken();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.confirmEmail({
        captcha_id: captchaData.captcha_id,
        captcha: captchaInput,
        code,
      });
      setAuth(response.data.user, response.data.token);
      router.push("/login");
    } catch (err: any) {
      console.error("Email confirmation error:", err);
      setError(err.response?.data?.message || "Invalid confirmation code or captcha");
      // Refresh captcha on failure
      fetchCaptcha();
      setCaptchaInput("");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useAuthStore((state) => state.logout);

  return (
    <form onSubmit={handleSubmit}>
      <LiquidGlass blur={20} opacity={0.15} borderOpacity={0.3} shadowIntensity={0.15} className="p-6 rounded-2xl space-y-4">
        {error && <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center animate-shake">{error}</div>}

        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Confirm Your Email</h3>
          <p className="text-sm text-text-secondary mt-1">Enter the confirmation code sent to your email</p>
        </div>

        <Input id="code" label="Confirmation Code" placeholder="Enter your code" type="text" required value={code} onChange={(e) => setCode(e.target.value)} leftIcon={<FontAwesomeIcon icon={faKey} className="w-4 h-4" />} autoComplete="one-time-code" />

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

        <Button type="submit" variant="primary" size="lg" className="w-full shadow-lg shadow-primary/20" loading={isLoading} rightIcon={!isLoading && <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />}>
          Confirm Email
        </Button>

        <div className="text-center text-sm text-text-secondary space-y-2">
          <div>
            Didn&apos;t receive the code?{" "}
            <button type="button" className="text-primary font-semibold hover:underline" onClick={() => router.push("/resend-email-verification")}>
              Resend Email
            </button>
          </div>
          <div>
            Already confirmed?{" "}
            <button
              type="button"
              className="text-primary font-semibold hover:underline"
              onClick={() => {
                logout().then(() => {
                  router.push("/login");
                });
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </LiquidGlass>
    </form>
  );
}
