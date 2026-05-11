"use client";

import { useEffect, useMemo, useState } from "react";
import { ListPageTemplate } from "@/components/templates/ListPageTemplate";
import { ProjectForm } from "@/components/molecules/ProjectForm";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/useProjects";
import { useOrganizations, useOrganizationsCursor } from "@/hooks/useOrganizations";
import { formatDate } from "@/lib/dateUtils";
import { useAppStore } from "@/stores";
import { SelectWithCursor } from "@/components/molecules/SelectWithCursor";

export default function ProjectsPage() {
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
  const [organizationSearch, setOrganizationSearch] = useState("");

  const { addToast, currentOrg, setCurrentOrg } = useAppStore();

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

    if (currentOrg) {
      params.organization_id = currentOrg;
    }

    return params;
  };

  const { data: projects, isLoading } = useProjects(getApiParams());
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const { data: organizationPages, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isOrganizationsLoading } = useOrganizationsCursor({ keyword: organizationSearch });

  const organizations = useMemo(() => {
    return organizationPages?.pages.flatMap((page) => page.data) || [];
  }, [organizationPages]);

  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      addToast({ message: "Project created successfully", type: "success" });
    } catch (error) {
      addToast({ message: "Failed to create project", type: "error" });
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      addToast({ message: "Project updated successfully", type: "success" });
    } catch (error) {
      addToast({ message: "Failed to update project", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      addToast({ message: "Project deleted successfully", type: "success" });
    } catch (error) {
      addToast({ message: "Failed to delete project", type: "error" });
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
        title="Projects"
        subtitle="Manage projects scoped to your organizations. Projects group features and resources."
        icon="folder-open"
        color="accent"
        data={projects?.data || []}
        isLoading={isLoading}
        keyField="id"
        enableDateRangeFilter={true}
        dateRangeFilterLabel="Filter by Creation Date"
        dateField="created_at"
        onDateRangeChange={handleDateRangeChange}
        dateRangeFilterValue={dateRange}
        onSearch={handleSearch}
        renderForm={(props) => <ProjectForm {...props} />}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        filters={
          <div className="flex items-center gap-3">
            <SelectWithCursor
              className="w-64"
              placeholder="Select Project"
              items={organizations}
              isLoading={isOrganizationsLoading || isFetchingNextPage}
              hasMore={!!hasNextPage}
              onLoadMore={() => fetchNextPage()}
              onSearch={(query) => setOrganizationSearch(query)}
              onSelect={(item) => setCurrentOrg(item.id)}
              selectedId={currentOrg}
            />
          </div>
        }
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
            key: "organization_id",
            label: "Organization",
            render: (row: any) => {
              const org = organizations.find((o: any) => o.id === row.organization_id);
              return <span className="badge inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-dim text-primary">{org?.name || "Unknown Org"}</span>;
            },
          },
          {
            key: "description",
            label: "Description",
            type: "desc",
            render: (row: any) => <span className="text-text-secondary text-xs truncate max-w-[260px] block">{row.description || "—"}</span>,
          },
          {
            key: "created_at",
            label: "Created",
            type: "date",
            sortable: true,
            render: (row: any) => <span className="table-cell-date text-text-muted text-xs">{formatDate(row.created_at)}</span>,
          },
        ]}
        emptyState={{
          icon: "folder-open",
          title: "No Projects Found",
          message: currentOrg ? "No projects in this organization. Create one to get started." : "No projects yet. Create your first one!",
        }}
      />
    </div>
  );
}
