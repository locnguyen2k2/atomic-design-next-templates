'use client';

import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { useUser } from '@/hooks/useUser';
import { useAppStore } from '@/stores';

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}

function getOrgName(orgId: string) {
  return orgId === 'org-001' ? 'Acme Corporation' : 'Unknown Organization';
}

export default function ProfilePage() {
  const { data: user, isLoading } = useUser();
  const { currentOrg, addToast } = useAppStore();

  const handleEditProfile = () => {
    addToast({ message: 'Profile editing coming soon', type: 'info' });
  };

  const handleRefreshToken = () => {
    addToast({ message: 'Token refreshed!', type: 'success' });
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({ message: 'Copied to clipboard', type: 'success' });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  const currentRole = user.organization_roles?.find(o => o.id === currentOrg)?.roles?.[0]?.name || 'Member';

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Your account details and session information.</p>
        </div>
      </div>

      {/* Profile Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">
          {user.first_name?.[0]}{user.last_name?.[0]}
        </div>
        <div className="profile-info">
          <div className="profile-name">{user.first_name} {user.last_name}</div>
          <div className="profile-email">{user.email}</div>
          <div className="profile-badges">
            <Badge variant="primary">
              <Icon name="shield-halved" /> {currentRole}
            </Badge>
            <Badge variant="success" dot>
              {user.status}
            </Badge>
            <Badge variant="muted">
              <Icon name="at" /> {user.email}
            </Badge>
          </div>
        </div>
        <Button variant="secondary" onClick={handleEditProfile} className="ml-auto z-[1]">
          <Icon name="pen" /> Edit Profile
        </Button>
      </div>

      {/* Content Grid */}
      <div className="content-grid content-grid-2col">
        {/* Account Details Card */}
        <Card>
          <Card.Header>
            <Card.Title>Account Details</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="meta-list">
              <div className="meta-item">
                <span className="meta-key">User ID</span>
                <span className="meta-value copy-pill" onClick={() => handleCopyToClipboard(user.id)}>
                  <Icon name="copy" /> {user.id}
                </span>
              </div>
              <div className="meta-divider" />
              <div className="meta-item">
                <span className="meta-key">Username</span>
                <span className="meta-value">@{user.username}</span>
              </div>
              <div className="meta-item">
                <span className="meta-key">Email</span>
                <span className="meta-value">{user.email}</span>
              </div>
              <div className="meta-item">
                <span className="meta-key">First Name</span>
                <span className="meta-value">{user.first_name}</span>
              </div>
              <div className="meta-item">
                <span className="meta-key">Last Name</span>
                <span className="meta-value">{user.last_name}</span>
              </div>
              <div className="meta-divider" />
              <div className="meta-item">
                <span className="meta-key">Status</span>
                <Badge variant="success">{user.status}</Badge>
              </div>
              <div className="meta-item">
                <span className="meta-key">Role</span>
                <Badge variant="primary">{currentRole}</Badge>
              </div>
              <div className="meta-divider" />
              <div className="meta-item">
                <span className="meta-key">Joined</span>
                <span className="meta-value">{formatDateTime(user.created_at)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-key">Last Updated</span>
                <span className="meta-value">{formatDateTime(user.updated_at)}</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Right Column */}
        <div>
          {/* Session Card */}
          <Card style={{ marginBottom: '16px' }}>
            <Card.Header>
              <Card.Title>Session</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="meta-list">
                <div className="meta-item">
                  <span className="meta-key">API Base</span>
                  <span className="meta-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                    localhost:3004/apis/v1
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-key">Auth</span>
                  <Badge variant="success">Bearer JWT</Badge>
                </div>
                <div className="meta-item">
                  <span className="meta-key">Token Status</span>
                  <Badge variant="success" dot>Valid</Badge>
                </div>
                <div className="meta-item">
                  <span className="meta-key">Expires In</span>
                  <span className="meta-value">3600s</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleRefreshToken} className="w-full mt-4">
                <Icon name="arrows-rotate" /> Refresh Token
              </Button>
            </Card.Body>
          </Card>

          {/* Current Context Card */}
          <Card>
            <Card.Header>
              <Card.Title>Current Context</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="meta-list">
                <div className="meta-item">
                  <span className="meta-key">Organization</span>
                  <Badge variant="primary">{user.organization_roles?.find(o => o.id === currentOrg)?.name || 'N/A'}</Badge>
                </div>
                <div className="meta-item">
                  <span className="meta-key">Org ID</span>
                  <span className="meta-value copy-pill" onClick={() => handleCopyToClipboard(currentOrg)}>
                    <Icon name="copy" /> {currentOrg}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-key">Projects</span>
                  <span className="meta-value">3</span>
                </div>
                <div className="meta-item">
                  <span className="meta-key">Features</span>
                  <span className="meta-value">12</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
