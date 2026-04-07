'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api';

export function useMe() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => usersApi.getMe().then(res => res.data),
  });
}

export function useUser(id?: string) {
  return useQuery({
    queryKey: ['users', id || 'me'],
    queryFn: () => id ? usersApi.get(id) : usersApi.getMe().then(res => res.data),
    enabled: true,
  });
}
