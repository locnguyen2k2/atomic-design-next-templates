'use client';

import { PermissionMatrix } from '@/components/organisms/PermissionMatrix';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { usePermissions } from '@/hooks/usePermissions';
import { useRoles } from '@/hooks/useRoles';
import { useAppStore } from '@/stores';
import Link from 'next/link';

export default function PermissionsPage() {
  const { resources, actions, matrix, togglePermission, saveChanges } = usePermissions();
  const { data: roles } = useRoles({});
  const { addToast } = useAppStore();

  const handleSave = async () => {
    await saveChanges();
    addToast({ message: 'Permission changes saved locally', type: 'success' });
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header flex items-start justify-between mb-8">
        <div className="page-header-info">
          <h1 className="page-title flex items-center gap-3 text-2xl font-bold text-text-primary tracking-tight">
            <span className="text-warning">
              <Icon name="key" />
            </span>
            Permissions
          </h1>
          <p className="page-subtitle text-text-muted mt-1 text-sm">
            Configure permissions per role across all resources. Click cells to toggle access.
          </p>
        </div>
        <div className="page-header-actions flex items-center gap-2">
          <Badge variant="warning" className="gap-1.5">
            <Icon name="triangle-exclamation" size="sm" />
            Beta — API endpoint pending
          </Badge>
          <Button size="sm" onClick={handleSave} className="h-9">
            <Icon name="check" className="mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Permission Matrix */}
      <Card className="mb-8">
        <Card.Header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <Card.Title className="text-sm font-bold">Permission Matrix</Card.Title>
            <Card.Subtitle className="text-xs text-text-muted mt-0.5">
              Rows = resources + actions · Columns = roles · Click checkbox to grant/revoke
            </Card.Subtitle>
          </div>
          <Link href="/roles">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <Icon name="shield" className="mr-1.5" /> Manage Roles
            </Button>
          </Link>
        </Card.Header>
        <Card.Body className="p-0 overflow-x-auto">
          <PermissionMatrix
            roles={roles?.data || []}
            resources={resources}
            actions={actions}
            matrix={matrix}
            onToggle={togglePermission}
          />
        </Card.Body>
      </Card>

      {/* Legend & Help */}
      <Card>
        <Card.Header className="border-b border-border px-5 py-4">
          <Card.Title className="text-sm font-bold">Legend</Card.Title>
        </Card.Header>
        <Card.Body className="flex flex-wrap items-center gap-6 py-4">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <div className="perm-check checked pointer-events-none">
              <Icon name="check" size="sm" />
            </div>
            <span>Access Granted</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <div className="perm-check pointer-events-none">
            </div>
            <span>Access Denied</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-text-muted">
            <Icon name="circle-info" className="text-primary/60" />
            <span>Changes are saved to local state only. Backend permission API is not yet available.</span>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
