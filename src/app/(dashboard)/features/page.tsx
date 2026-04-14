"use client";

import { useState, useMemo, useEffect } from "react";
import { ListPageTemplate } from "@/components/templates/ListPageTemplate";
import { FeatureForm } from "@/components/molecules/FeatureForm";
import { SelectWithCursor } from "@/components/molecules/SelectWithCursor";
import { useFeatures, useCreateFeature, useUpdateFeature, useDeleteFeature } from "@/hooks/useFeatures";
import { useProjectsCursor } from "@/hooks/useProjects";
import { Badge } from "@/components/atoms/Badge";
import { formatDate } from "@/lib/dateUtils";
import { useAppStore } from "@/stores";

export default function FeaturesPage() {
  const { currentProject, setCurrentProject, addToast } = useAppStore();
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
  const [projectSearch, setProjectSearch] = useState("");

  const { data: projectPages, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isProjectsLoading } = useProjectsCursor({ keyword: projectSearch });

  const projects = useMemo(() => {
    return projectPages?.pages.flatMap((page) => page.data) || [];
  }, [projectPages]);

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

  const { data: features, isLoading } = useFeatures(getApiParams());
  const createMutation = useCreateFeature();
  const updateMutation = useUpdateFeature();
  const deleteMutation = useDeleteFeature();

  useEffect(() => {
    if (projects.length === 0) {
      if (currentProject) {
        setCurrentProject("");
      }
    } else {
      if (!currentProject) {
        setCurrentProject(projects[0].id);
      }
    }
  }, [currentProject, projects, setCurrentProject]);

  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      addToast({ message: "Feature created successfully", type: "success" });
    } catch (error) {
      addToast({ message: "Failed to create feature", type: "error" });
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      addToast({ message: "Feature updated successfully", type: "success" });
    } catch (error) {
      addToast({ message: "Failed to update feature", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      addToast({ message: "Feature deleted successfully", type: "success" });
    } catch (error) {
      addToast({ message: "Failed to delete feature", type: "error" });
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
        title="Features"
        subtitle="Control feature flags across your projects. Toggle functionality in real-time."
        icon="flag"
        color="success"
        data={features?.data || []}
        isLoading={isLoading}
        keyField="id"
        enableDateRangeFilter={true}
        dateRangeFilterLabel="Filter by Update Date"
        dateField="updated_at"
        onDateRangeChange={handleDateRangeChange}
        dateRangeFilterValue={dateRange}
        onSearch={handleSearch}
        renderForm={(props) => <FeatureForm {...props} />}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        filters={
          <div className="flex items-center gap-3">
            <SelectWithCursor
              className="w-64"
              placeholder="Select Project"
              items={projects}
              isLoading={isProjectsLoading || isFetchingNextPage}
              hasMore={!!hasNextPage}
              onLoadMore={() => fetchNextPage()}
              onSearch={(query) => setProjectSearch(query)}
              onSelect={(item) => setCurrentProject(item.id)}
              selectedId={currentProject}
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
                <span className="table-cell-slug text-text-muted text-xs block">{row.slug}</span>
              </div>
            ),
          },
          {
            key: "is_enabled",
            label: "Status",
            render: (row: any) => (
              <Badge variant={row.is_enabled ? "success" : "muted"} dot={row.is_enabled}>
                {row.is_enabled ? "Enabled" : "Disabled"}
              </Badge>
            ),
          },
          {
            key: "project_id",
            label: "Project",
            render: (row: any) => <span className="text-xs font-mono text-text-secondary">{row.project_id}</span>,
          },
          {
            key: "description",
            label: "Description",
            type: "desc",
            render: (row: any) => <span className="text-text-secondary text-xs truncate max-w-[260px] block">{row.description || "—"}</span>,
          },
          {
            key: "updated_at",
            label: "Last Updated",
            type: "date",
            sortable: true,
            render: (row: any) => <span className="table-cell-date text-text-muted text-xs">{formatDate(row.updated_at)}</span>,
          },
        ]}
        emptyState={{
          icon: "flag",
          title: "No Features Found",
          message: currentProject ? "No features in this project. Create one to get started." : "Select a project to view its features.",
        }}
      />
    </div>
  );
}
