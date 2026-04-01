'use client';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { ProjectForm } from '@/components/molecules/ProjectForm';
import { useProjects } from '@/hooks/useProjects';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useState } from 'react';
import { formatDate } from '@/lib/dateUtils';

export default function ProjectsPage() {
  const [orgFilter, setOrgFilter] = useState('');
  const { data: projects, isLoading } = useProjects({ organization_id: orgFilter });
  const { data: organizations } = useOrganizations({});

  return (
    <div className="animate-fade-in">
      <ListPageTemplate
        title="Projects"
        subtitle="Manage projects scoped to your organizations. Projects group features and resources."
        icon="folder-open"
        color="accent"
        data={projects?.data || []}
        isLoading={isLoading}
        keyField="id"
        renderForm={(props) => <ProjectForm {...props} />}
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
                <span className="table-cell-slug text-text-muted text-xs block">/{row.slug}</span>
              </div>
            ),
          },
          {
            key: 'organization_id',
            label: 'Organization',
            render: (row: any) => {
              const org = organizations?.data?.find((o: any) => o.id === row.organization_id);
              return (
                <span className="badge inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-dim text-primary">
                  {org?.name || 'Unknown Org'}
                </span>
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
          icon: 'folder-open',
          title: 'No Projects Found',
          message: orgFilter 
            ? 'No projects in this organization. Create one to get started.'
            : 'No projects yet. Create your first one!',
        }}
      />
    </div>
  );
}
