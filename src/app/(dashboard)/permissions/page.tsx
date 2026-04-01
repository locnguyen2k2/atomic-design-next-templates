'use client';

import { PermissionMatrix } from '@/components/organisms/PermissionMatrix';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { usePermissions } from '@/hooks/usePermissions';
import { useRoles } from '@/hooks/useRoles';
import { useAppStore } from '@/stores';

export default function PermissionsPage() {
  const { resources, actions, matrix, togglePermission, saveChanges } = usePermissions();
  const { data: roles } = useRoles({});
  const { addToast } = useAppStore();

  const handleSave = async () => {
    await saveChanges();
    addToast({ message: 'Permissions saved successfully', type: 'success' });
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header flex items-start justify-between mb-8">
        <div className="page-header-info">
          <h1 className="page-title flex items-center gap-3 text-2xl font-bold text-text-primary">
            <Icon name="key" className="text-warning" />
            Permissions
          </h1>
          <p className="page-subtitle text-text-muted mt-1 text-sm">
            Configure permissions per role across all resources. Click cells to toggle access.
          </p>
        </div>
        <div className="page-header-actions flex gap-2">
          <Badge variant="warning">
            Beta — API endpoint pending
          </Badge>
          <Button size="sm" onClick={handleSave} className="h-9">
            <Icon name="check" className="mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Permission Matrix */}
      <Card className="mb-8">
        <Card.Header className="flex items-center justify-between">
          <div>
            <Card.Title>Permission Matrix</Card.Title>
            <Card.Subtitle>
              Rows = resources · Columns = roles · Click checkbox to grant/revoke
            </Card.Subtitle>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            <Icon name="shield" className="mr-1.5" /> Manage Roles
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          <PermissionMatrix
            roles={roles?.data || [
              { id: 'role_1', name: 'Super Admin' },
              { id: 'role_2', name: 'Developer' }
            ]}
            resources={resources}
            actions={actions}
            matrix={matrix}
            onToggle={togglePermission}
          />
        </Card.Body>
      </Card>

      {/* Legend & Help */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>Legend</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <div className="w-6 h-6 rounded border border-primary bg-primary flex items-center justify-center">
                  <Icon name="check" className="text-white text-xs" />
                </div>
                <span>Access Granted</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <div className="w-6 h-6 rounded border border-border flex items-center justify-center">
                </div>
                <span>Access Denied</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>System Information</Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-text-muted leading-relaxed">
              Permissions are additive. If a user has multiple roles, they gain the combined permissions of all assigned roles. 
              Changes to the matrix take effect immediately for all users with the modified roles.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-warning bg-warning-dim p-3 rounded-lg border border-warning/20">
              <Icon name="warning" />
              <span>Backend sync is currently simulated. Reloading will reset changes.</span>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
