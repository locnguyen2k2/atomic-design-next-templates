'use client';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { OrganizationForm } from '@/components/molecules/OrganizationForm';
import { useOrganizations } from '@/hooks/useOrganizations';
import { formatDate } from '@/lib/dateUtils';

export default function OrganizationsPage() {
  const { data: organizations, isLoading } = useOrganizations({});

  return (
    <div className="animate-fade-in">
      <ListPageTemplate
        title="Organizations"
        subtitle="Manage your multi-tenant organizations. All other resources are scoped to organizations."
        icon="building"
        color="primary"
        data={organizations?.data || [] as any[]}
        isLoading={isLoading}
        keyField="id"
        renderForm={(props) => <OrganizationForm {...props} />}
        columns={[
          {
            key: 'name',
            label: 'Name / Slug',
            sortable: true,
            render: (row: any) => (
              <div className="table-cell-meta">
                <span className="table-cell-name font-medium text-text-primary">{row.name}</span>
                <span className="table-cell-slug text-text-muted text-xs block">/{row.slug}</span>
              </div>
            ),
          },
          {
            key: 'description',
            label: 'Description',
            type: 'desc',
            render: (row: any) => (
              <span className="text-text-secondary text-xs truncate max-w-[260px] block">
                {row.description || 'No description provided'}
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
          {
            key: 'updated_at',
            label: 'Updated',
            type: 'date',
            sortable: true,
            render: (row: any) => (
              <span className="table-cell-date text-text-muted text-xs">
                {formatDate(row.updated_at)}
              </span>
            ),
          },
        ]}
        emptyState={{
          icon: 'building',
          title: 'No Organizations Found',
          message: 'Create your first organization to get started.',
        }}
      />
    </div>
  );
}
