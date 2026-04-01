'use client';

import { Card } from '@/components/atoms/Card';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { useUser } from '@/hooks/useUser';
import { useAppStore } from '@/stores';

export default function ProfilePage() {
  const { user } = useUser();
  const { addToast } = useAppStore();

  const handleUpdateProfile = () => {
    addToast({ message: 'Profile updated successfully', type: 'success' });
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="page-header flex items-start justify-between mb-8">
        <div className="page-header-info">
          <h1 className="page-title text-2xl font-bold text-text-primary tracking-tight">User Profile</h1>
          <p className="page-subtitle text-text-muted mt-1 text-sm">
            Manage your personal information and session security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Avatar initials={`${user.first_name[0]}${user.last_name[0]}`} size="lg" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-sm text-text-muted mt-1">{user.email}</p>
            <div className="mt-4 flex justify-center">
              <Badge variant="violet">{user.role}</Badge>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3">
              <Button variant="secondary" className="w-full">
                <Icon name="pen" className="mr-2" /> Change Avatar
              </Button>
              <Button variant="danger" className="w-full">
                <Icon name="arrow-right-from-bracket" className="mr-2" /> Log out
              </Button>
            </div>
          </Card>
        </div>

        {/* Info & Sessions */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <Card>
            <Card.Header>
              <Card.Title>General Information</Card.Title>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name">
                  <Input value={user.first_name} readOnly disabled />
                </FormField>
                <FormField label="Last Name">
                  <Input value={user.last_name} readOnly disabled />
                </FormField>
              </div>
              <FormField label="Email Address">
                <Input value={user.email} readOnly disabled />
              </FormField>
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </Card.Body>
          </Card>

          {/* Active Sessions */}
          <Card>
            <Card.Header>
              <Card.Title>Active Sessions</Card.Title>
              <Card.Subtitle>Locations and browsers where you're currently logged in.</Card.Subtitle>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="flex flex-col">
                {user.sessions.map((session, index) => (
                  <div 
                    key={session.id} 
                    className={`flex items-center gap-4 p-4 ${index !== user.sessions.length - 1 ? 'border-b border-border-subtle' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-bg-surface flex items-center justify-center text-text-muted">
                      <Icon name={session.browser.includes('iPhone') ? 'mobile' : 'laptop'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary">{session.browser}</div>
                      <div className="text-xs text-text-muted mt-0.5">{session.ip} · Last active: {session.last_active}</div>
                    </div>
                    {session.last_active === 'Now' ? (
                      <Badge variant="success">Current</Badge>
                    ) : (
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-danger hover:text-danger hover:bg-danger-dim">
                        Terminate
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
