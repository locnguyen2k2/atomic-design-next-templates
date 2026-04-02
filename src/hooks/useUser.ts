'use client';

import { useState } from 'react';

export function useUser() {
  const [user] = useState({
    id: 'user_123',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    role: 'Super Admin',
    status: 'active',
    username: 'johndoe',
    organizations: ['Acme Corp', 'TechStart Inc'],
    sessions: [
      { id: 'sess_1', browser: 'Chrome on macOS', ip: '192.168.1.1', last_active: 'Now' },
      { id: 'sess_2', browser: 'Safari on iPhone', ip: '10.0.0.5', last_active: '2 hours ago' },
    ],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-10-20T14:45:00Z',
    organization_id: 'org-001',
  });

  return { user };
}
