'use client';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { RoleForm } from '@/components/molecules/RoleForm';
import { useRoles } from '@/hooks/useRoles';
import { Badge } from '@/components/atoms/Badge';
import { formatDate } from '@/lib/dateUtils';

export default function RolesPage() {
  const { data: roles, isLoading } = useRoles({});

  return (
    <div className="animate-fade-in">
      <ListPageTemplate
        title="Roles"
        subtitle="Manage user roles and their associated permissions. Define granular access control."
        icon="shield"
        color="violet"
        data={roles?.data || []}
        isLoading={isLoading}
        keyField="id"
        renderForm={(props) => <RoleForm {...props} />}
        columns={[
          {
            key: 'name',
            label: 'Name / Slug',
            sortable: true,
            render: (row: any) => (
              <div className="table-cell-meta">
                <span className="table-cell-name font-medium text-text-primary">{row.name}</span>
                <span className="table-cell-slug text-text-muted text-xs block">{row.slug}</span>
              </div>
            ),
          },
          {
            key: 'permissions',
            label: 'Permissions',
            render: (row: any) => {
              const count = Object.keys(row.permissions || {}).length;
              return (
                <Badge variant="violet">
                  {count} action{count !== 1 ? 's' : ''}
                </Badge>
              );
            },
          },
          {
            key: 'description',
            label: 'Description',
            type: 'desc',
            render: (row: any) => (
              <span className="text-text-secondary text-xs truncate max-w-[260px] block">
                {row.description || '—'}
              </span>
            ),
          },
          {
            key: 'created_at',
            label: 'Created',
            type: 'date',
            sortable: true,
            render: (row: any) => (
              <span className="table-cell-date text-text-muted text-xs">
                {formatDate(row.created_at)}
              </span>
            ),
          },
        ]}
        emptyState={{
          icon: 'shield',
          title: 'No Roles Found',
          message: 'No roles yet. Create your first one to define access control!',
        }}
      />
    </div>
  );
}
