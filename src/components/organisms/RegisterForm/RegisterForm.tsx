'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/atoms';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faArrowRight, faAddressCard } from '@fortawesome/free-solid-svg-icons';

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(formData);
      setAuth(response.data.user, response.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center animate-shake">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="first_name"
          label="First Name"
          placeholder="John"
          type="text"
          required
          value={formData.first_name}
          onChange={handleChange}
          leftIcon={<FontAwesomeIcon icon={faAddressCard} className="w-4 h-4" />}
        />
        <Input
          id="last_name"
          label="Last Name"
          placeholder="Doe"
          type="text"
          required
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>

      <Input
        id="username"
        label="Username"
        placeholder="johndoe"
        type="text"
        required
        value={formData.username}
        onChange={handleChange}
        leftIcon={<FontAwesomeIcon icon={faUser} className="w-4 h-4" />}
        autoComplete="username"
      />

      <Input
        id="email"
        label="Email Address"
        placeholder="john@example.com"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
        leftIcon={<FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />}
        autoComplete="email"
      />

      <Input
        id="password"
        label="Password"
        placeholder="••••••••"
        type="password"
        required
        value={formData.password}
        onChange={handleChange}
        leftIcon={<FontAwesomeIcon icon={faLock} className="w-4 h-4" />}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-2 shadow-lg shadow-primary/20"
        loading={isLoading}
        rightIcon={!isLoading && <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />}
      >
        Create Account
      </Button>

      <div className="text-center text-sm text-text-secondary pt-2">
        Already have an account?{' '}
        <button
          type="button"
          className="text-primary font-semibold hover:underline"
          onClick={() => router.push('/login')}
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
