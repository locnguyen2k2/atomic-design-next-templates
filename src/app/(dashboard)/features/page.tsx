'use client';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { FeatureForm } from '@/components/molecules/FeatureForm';
import { useFeatures } from '@/hooks/useFeatures';
import { useOrganizations } from '@/hooks/useOrganizations';
import { Badge } from '@/components/atoms/Badge';
import { useState } from 'react';
import { formatDate } from '@/lib/dateUtils';

export default function FeaturesPage() {
  const [orgFilter, setOrgFilter] = useState('');
  const { data: features, isLoading } = useFeatures({ organization_id: orgFilter });
  const { data: organizations } = useOrganizations({});

  return (
    <div className="animate-fade-in">
      <ListPageTemplate
        title="Features"
        subtitle="Control feature flags across your projects. Toggle functionality in real-time."
        icon="flag"
        color="success"
        data={features?.data || []}
        isLoading={isLoading}
        keyField="id"
        renderForm={(props) => <FeatureForm {...props} />}
        filters={
          <select
            className="toolbar-select h-10 px-3 rounded-lg border border-border bg-bg-elevated text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
          >
            <option value="">All Organizations</option>
            {organizations?.data?.map((org: any) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        }
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
            key: 'is_enabled',
            label: 'Status',
            render: (row: any) => (
              <Badge variant={row.is_enabled ? 'success' : 'muted'} dot={row.is_enabled}>
                {row.is_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            ),
          },
          {
            key: 'project_id',
            label: 'Project',
            render: (row: any) => (
              <span className="text-xs font-mono text-text-secondary">{row.project_id}</span>
            ),
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
            key: 'updated_at',
            label: 'Last Updated',
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
          icon: 'flag',
          title: 'No Features Found',
          message: orgFilter 
            ? 'No features in this organization. Create one to get started.'
            : 'No features yet. Create your first one!',
        }}
      />
    </div>
  );
}
