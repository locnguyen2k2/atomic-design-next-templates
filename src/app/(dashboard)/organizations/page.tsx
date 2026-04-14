"use client";

import { useState } from "react";
import { ListPageTemplate } from "@/components/templates/ListPageTemplate";
import { OrganizationForm } from "@/components/molecules/OrganizationForm";
import { useOrganizations, useCreateOrganization, useUpdateOrganization, useDeleteOrganization } from "@/hooks/useOrganizations";
import { formatDate } from "@/lib/dateUtils";
import { useAppStore } from "@/stores";

export default function OrganizationsPage() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>(() => {
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    return {
      from: oneMonthAgo,
      to: now,
    };
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { addToast } = useAppStore();

  const getApiParams = () => {
    const params: any = {};

    if (searchQuery) {
      params.search = searchQuery;
    }

    if (dateRange.from) {
      params.from_date = dateRange.from.toISOString().split("T")[0];
    }

    if (dateRange.to) {
      params.to_date = dateRange.to.toISOString().split("T")[0];
    }

    return params;
  };

  const { data: organizations, isLoading } = useOrganizations(getApiParams());
  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();

  console.log("organizations", organizations);
  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      addToast({ message: "Organization created successfully", type: "success" });
    } catch (error) {
      addToast({ message: "Failed to create organization", type: "error" });
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      addToast({ message: "Organization updated successfully", type: "success" });
    } catch (error) {
      addToast({ message: "Failed to update organization", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      addToast({ message: "Organization deleted successfully", type: "success" });
    } catch (error) {
      addToast({ message: "Failed to delete organization", type: "error" });
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
        title="Organizations"
        subtitle="Manage your multi-tenant organizations. All other resources are scoped to organizations."
        icon="building"
        color="primary"
        data={organizations?.data || []}
        isLoading={isLoading}
        keyField="id"
        enableDateRangeFilter={true}
        dateRangeFilterLabel="Filter by Creation Date"
        dateField="createdAt"
        onDateRangeChange={handleDateRangeChange}
        dateRangeFilterValue={dateRange}
        onSearch={handleSearch}
        renderForm={(props) => <OrganizationForm {...props} />}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        columns={[
          {
            key: "name",
            label: "Name / Slug",
            sortable: true,
            render: (row: any) => (
              <div className="table-cell-meta">
                <span className="table-cell-name font-medium text-text-primary">{row.name}</span>
                <span className="table-cell-slug text-text-muted text-xs block">/{row.slug}</span>
              </div>
            ),
          },
          {
            key: "description",
            label: "Description",
            type: "desc",
            render: (row: any) => <span className="text-text-secondary text-xs truncate max-w-[260px] block">{row.description || "No description provided"}</span>,
          },
          {
            key: "created_at",
            label: "Created",
            type: "date",
            sortable: true,
            render: (row: any) => <span className="table-cell-date text-text-muted text-xs">{formatDate(row.created_at)}</span>,
          },
          {
            key: "updated_at",
            label: "Updated",
            type: "date",
            sortable: true,
            render: (row: any) => <span className="table-cell-date text-text-muted text-xs">{formatDate(row.updated_at)}</span>,
          },
        ]}
        emptyState={{
          icon: "building",
          title: "No Organizations Found",
          message: "Create your first organization to get started.",
        }}
      />
    </div>
  );
}
