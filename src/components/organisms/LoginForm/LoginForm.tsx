"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Icon, LiquidGlass } from "@/components/atoms";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faArrowRight, faShieldAlt, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import type { CaptchaData } from "@/types";

export function LoginForm({ effectedForm }: any) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login({
        username,
        password,
        captcha_id: captchaData.captcha_id,
        captcha: captchaInput,
      });
      setAuth(response.data.user, response.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      console.log("Login error:", err);
      setError(err.response?.data?.message || "Invalid username, password, or captcha");
      // Refresh captcha on failure
      fetchCaptcha();
      setCaptchaInput("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={`login ${effectedForm === 1}`} onSubmit={handleSubmit}>
      <LiquidGlass blur={20} opacity={0.15} borderOpacity={0.3} shadowIntensity={0.15} className="p-6 rounded-2xl space-y-4">
        <h3 className="form-title text-lg font-semibold text-text-primary">Login</h3>
        {error && <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center animate-shake">{error}</div>}

        <Input id="username" label="Username" placeholder="Enter your username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} leftIcon={<FontAwesomeIcon icon={faUser} className="w-4 h-4" />} autoComplete="username" />

        <div className="space-y-1">
          <Input
            id="password"
            label="Password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<FontAwesomeIcon icon={faLock} className="w-4 h-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none hover:text-primary transition-colors">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
              </button>
            }
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
              onClick={() => {
                /* Forgot password logic */
              }}
            >
              Forgot password?
            </button>
          </div>
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

        <Button type="submit" variant="primary" size="lg" className="w-full shadow-lg shadow-primary/20" loading={isLoading} rightIcon={!isLoading && <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />}>
          Sign In
        </Button>
      </LiquidGlass>
    </form>
  );
}
