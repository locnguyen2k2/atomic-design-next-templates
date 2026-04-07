'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/atoms';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ username, password });
      setAuth(response.data.user, response.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center animate-shake">
          {error}
        </div>
      )}

      <Input
        id="username"
        label="Username"
        placeholder="Enter your username"
        type="text"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        leftIcon={<FontAwesomeIcon icon={faUser} className="w-4 h-4" />}
        autoComplete="username"
      />

      <div className="space-y-1">
        <Input
          id="password"
          label="Password"
          placeholder="••••••••"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<FontAwesomeIcon icon={faLock} className="w-4 h-4" />}
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <button 
            type="button"
            className="text-xs text-primary hover:text-primary/80 transition-colors"
            onClick={() => {/* Forgot password logic */}}
          >
            Forgot password?
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full shadow-lg shadow-primary/20"
        loading={isLoading}
        rightIcon={!isLoading && <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />}
      >
        Sign In
      </Button>

      <div className="text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <button
          type="button"
          className="text-primary font-semibold hover:underline"
          onClick={() => router.push('/register')}
        >
          Create account
        </button>
      </div>
    </form>
  );
}
