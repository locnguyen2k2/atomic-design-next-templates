"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/molecules/StatCard";
import { Card } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { QuickActionCard } from "@/components/molecules/QuickActionCard";
import { ActivityList } from "@/components/molecules/ActivityList";
import { GrowthChart, type ChartType } from "@/components/molecules/GrowthChart/GrowthChart";
import { ModalDrawer } from "@/components/organisms/ModalDrawer";
import { OrganizationForm } from "@/components/molecules/OrganizationForm";
import { ProjectForm } from "@/components/molecules/ProjectForm";
import { FeatureForm } from "@/components/molecules/FeatureForm";
import { RoleForm } from "@/components/molecules/RoleForm";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useActivity } from "@/hooks/useActivity";
import { useGrowthStats } from "@/hooks/useGrowthStats";
import { type GrowthEntity, type GrowthPeriod } from "@/api/stats";

export default function DashboardPage() {
  const { stats } = useDashboardStats();
  const { activities } = useActivity();

  const [growthEntity, setGrowthEntity] = useState<GrowthEntity>("features");
  const [growthPeriod, setGrowthPeriod] = useState<GrowthPeriod>("week");
  const [chartType, setChartType] = useState<ChartType>("column");

  const { growthData, title: growthTitle, isLoading: isGrowthLoading } = useGrowthStats(growthEntity, growthPeriod);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEntity, setModalEntity] = useState<"organization" | "project" | "feature" | "role" | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (entity: "organization" | "project" | "feature" | "role") => {
    setModalEntity(entity);
    setModalData({});
    setModalOpen(true);
  };

  const handleSave = (data: any) => {
    console.log(`Saving ${modalEntity}:`, data);
    setModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header flex items-start justify-between mb-8">
        <div className="page-header-info">
          <h1 className="page-title text-2xl font-bold text-text-primary tracking-tight">Dashboard</h1>
          <p className="page-subtitle text-text-muted mt-1 text-sm">Welcome back! Here&apos;s what&apos;s happening across your systems.</p>
        </div>
        <div className="page-header-actions">
          <Button variant="secondary" size="sm" className="h-9">
            <Icon name="refresh" className="mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 stagger-children">
        <StatCard icon="building" label="Organizations" value={stats.organizations} color="primary" percentage={78} hint="+2 this month" />
        <StatCard icon="folder-open" label="Projects" value={stats.projects} color="accent" percentage={62} hint={`${stats.currentOrgProjects} in current org`} />
        <StatCard icon="flag" label="Features" value={stats.features} color="success" percentage={55} hint={`${stats.currentOrgFeatures} in current org`} />
        <StatCard icon="shield" label="Roles" value={stats.roles} color="violet" percentage={90} hint="RBAC configured" />
        <StatCard icon="users" label="Active Users" value={stats.activeUsers} color="warning" percentage={72} hint="+3 new this week" />
        <StatCard icon="users" label="Staffs" value="99.8%" color="success" percentage={99} hint="+2 this month" />
      </div>

      {/* Charts + Activity */}
      <div className="content-grid grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Activity Chart */}
        <Card className="flex flex-col h-full">
          <Card.Header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Card.Title>{growthTitle || "Growth Activity"}</Card.Title>
              <Card.Subtitle>Monitor trends across your entities</Card.Subtitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select 
                value={growthEntity} 
                onChange={(e) => setGrowthEntity(e.target.value as GrowthEntity)}
                className="bg-bg-surface text-text-primary text-xs rounded border border-border px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="features">Features</option>
                <option value="projects">Projects</option>
                <option value="organizations">Orgs</option>
                <option value="roles">Roles</option>
                <option value="users">Users</option>
              </select>
              <select 
                value={growthPeriod} 
                onChange={(e) => setGrowthPeriod(e.target.value as GrowthPeriod)}
                className="bg-bg-surface text-text-primary text-xs rounded border border-border px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
              <div className="flex bg-bg-surface p-1 rounded border border-border">
                {(['column', 'line', 'pie'] as ChartType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartType(t)}
                    className={cn(
                      "p-1 rounded text-xs transition-colors",
                      chartType === t ? "bg-primary text-primary-foreground" : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    <Icon name={t === 'column' ? 'grid-2' : t === 'line' ? 'trend-up' : 'list'} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          </Card.Header>
          <Card.Body className="flex-1 flex flex-col justify-center py-6">
            {isGrowthLoading ? (
              <div className="flex items-center justify-center h-48 animate-pulse text-text-muted">
                Loading data...
              </div>
            ) : (
              <GrowthChart data={growthData} type={chartType} />
            )}
          </Card.Body>
        </Card>

        {/* Recent Activity */}
        <Card className="flex flex-col h-full">
          <Card.Header className="flex items-center justify-between">
            <div>
              <Card.Title>Recent Activity</Card.Title>
              <Card.Subtitle>Latest actions across all entities</Card.Subtitle>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              View all <Icon name="chevron-right" className="ml-1" size="sm" />
            </Button>
          </Card.Header>
          <Card.Body className="p-0 overflow-y-auto max-h-[400px]">
            <ActivityList activities={activities} />
          </Card.Body>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <Card.Title>Quick Actions</Card.Title>
          <Card.Subtitle>Jump straight to common tasks</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <div className="quick-actions-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <QuickActionCard icon="building" label="New Org" color="primary" onClick={() => openModal("organization")} />
            <QuickActionCard icon="folder-open" label="New Project" color="accent" onClick={() => openModal("project")} />
            <QuickActionCard icon="flag" label="New Feature" color="success" onClick={() => openModal("feature")} />
            <QuickActionCard icon="shield" label="New Role" color="violet" onClick={() => openModal("role")} />
            <QuickActionCard icon="users" label="Manage Users" color="warning" href="/profile" />
            <QuickActionCard icon="key" label="Permissions" color="danger" href="/policy" />
          </div>
        </Card.Body>
      </Card>

      {/* Modals */}
      {modalEntity && (
        <ModalDrawer open={modalOpen} mode="create" entity={modalEntity} data={modalData} onClose={() => setModalOpen(false)} onSave={handleSave}>
          {({ activeTab }) => {
            switch (modalEntity) {
              case "organization":
                return <OrganizationForm mode="create" data={modalData} onChange={setModalData} />;
              case "project":
                return <ProjectForm mode="create" data={modalData} onChange={setModalData} />;
              case "feature":
                return <FeatureForm mode="create" data={modalData} onChange={setModalData} />;
              case "role":
                return <RoleForm mode="create" activeTab={activeTab} data={modalData} onChange={setModalData} />;
              default:
                return null;
            }
          }}
        </ModalDrawer>
      )}
    </div>
  );
}
