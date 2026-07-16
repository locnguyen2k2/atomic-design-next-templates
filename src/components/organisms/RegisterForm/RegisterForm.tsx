"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Icon, Input, LiquidGlass } from "@/components/atoms";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faArrowRight, faAddressCard, faShieldAlt, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { CaptchaData } from "@/types";

export function RegisterForm({ effectedForm }: any) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register({ ...formData, captcha_id: captchaData!.captcha_id, captcha: captchaInput });
      setAuth(response.data.user, response.data.token);
      router.push("/email-confirmation");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      fetchCaptcha();
      setCaptchaInput("");
      setIsLoading(false);
    }
  };

  return (
    <form className={`register ${effectedForm === 2}`} onSubmit={handleSubmit}>
      <LiquidGlass blur={20} opacity={0.15} borderOpacity={0.3} shadowIntensity={0.15} className="p-6 rounded-2xl space-y-4">
        <h3 className="form-title text-lg font-semibold text-text-primary">Register</h3>
        {error && <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center animate-shake">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <Input id="first_name" label="First Name" placeholder="John" type="text" required value={formData.first_name} onChange={handleChange} leftIcon={<FontAwesomeIcon icon={faAddressCard} className="w-4 h-4" />} />
          <Input id="last_name" label="Last Name" placeholder="Doe" type="text" required value={formData.last_name} onChange={handleChange} />
        </div>

        <Input id="username" label="Username" placeholder="johndoe" type="text" required value={formData.username} onChange={handleChange} leftIcon={<FontAwesomeIcon icon={faUser} className="w-4 h-4" />} autoComplete="username" />

        <Input id="email" label="Email Address" placeholder="john@example.com" type="email" required value={formData.email} onChange={handleChange} leftIcon={<FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />} autoComplete="email" />

        <Input
          id="password"
          label="Password"
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
          required
          value={formData.password}
          onChange={handleChange}
          leftIcon={<FontAwesomeIcon icon={faLock} className="w-4 h-4" />}
          autoComplete="new-password"
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-text-tertiary hover:text-text-primary transition-colors">
              {showPassword ? <FontAwesomeIcon icon={faEyeSlash} className="w-4 h-4" /> : <FontAwesomeIcon icon={faEye} className="w-4 h-4" />}
            </button>
          }
        />

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

        <Button type="submit" variant="primary" size="lg" className="w-full mt-2 shadow-lg shadow-primary/20" loading={isLoading} rightIcon={!isLoading && <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />}>
          Create Account
        </Button>
      </LiquidGlass>
    </form>
  );
}
