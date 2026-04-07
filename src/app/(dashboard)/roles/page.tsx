'use client';

import { useState } from 'react';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { RoleForm } from '@/components/molecules/RoleForm';
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from '@/hooks/useRoles';
import { Badge } from '@/components/atoms/Badge';
import { formatDate } from '@/lib/dateUtils';
import { useAppStore } from '@/stores';

export default function RolesPage() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>(() => {
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    return {
      from: oneMonthAgo,
      to: now
    };
  });
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useAppStore();

  const getApiParams = () => {
    const params: any = {};
    
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    if (dateRange.from) {
      params.from_date = dateRange.from.toISOString().split('T')[0];
    }
    
    if (dateRange.to) {
      params.to_date = dateRange.to.toISOString().split('T')[0];
    }
    
    return params;
  };

  const { data: roles, isLoading } = useRoles(getApiParams());
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      addToast({ message: 'Role created successfully', type: 'success' });
    } catch (error) {
      addToast({ message: 'Failed to create role', type: 'error' });
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      addToast({ message: 'Role updated successfully', type: 'success' });
    } catch (error) {
      addToast({ message: 'Failed to update role', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      addToast({ message: 'Role deleted successfully', type: 'success' });
    } catch (error) {
      addToast({ message: 'Failed to delete role', type: 'error' });
    }
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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
        enableDateRangeFilter={true}
        dateRangeFilterLabel="Filter by Creation Date"
        dateField="created_at"
        onDateRangeChange={handleDateRangeChange}
        dateRangeFilterValue={dateRange}
        onSearch={handleSearch}
        renderForm={(props) => <RoleForm {...props} />}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
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
