'use client';

import { StatCard } from '@/components/molecules/StatCard';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { QuickActionCard } from '@/components/molecules/QuickActionCard';
import { ActivityList } from '@/components/molecules/ActivityList';
import { WeeklyChart } from '@/components/molecules/WeeklyChart';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useActivity } from '@/hooks/useActivity';

export default function DashboardPage() {
  const { stats, isLoading } = useDashboardStats();
  const { activities } = useActivity();

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header flex items-start justify-between mb-8">
        <div className="page-header-info">
          <h1 className="page-title text-2xl font-bold text-text-primary tracking-tight">Dashboard</h1>
          <p className="page-subtitle text-text-muted mt-1 text-sm">
            Welcome back! Here's what's happening across your systems.
          </p>
        </div>
        <div className="page-header-actions">
          <Button variant="secondary" size="sm" className="h-9">
            <Icon name="refresh" className="mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 stagger-children">
        <StatCard
          icon="building"
          label="Organizations"
          value={stats.organizations}
          color="primary"
          percentage={78}
          hint="+2 this month"
        />
        <StatCard
          icon="folder-open"
          label="Projects"
          value={stats.projects}
          color="accent"
          percentage={62}
          hint={`${stats.currentOrgProjects} in current org`}
        />
        <StatCard
          icon="flag"
          label="Features"
          value={stats.features}
          color="success"
          percentage={55}
          hint={`${stats.currentOrgFeatures} in current org`}
        />
        <StatCard
          icon="shield"
          label="Roles"
          value={stats.roles}
          color="violet"
          percentage={90}
          hint="RBAC configured"
        />
        <StatCard
          icon="users"
          label="Active Users"
          value={stats.activeUsers}
          color="warning"
          percentage={72}
          hint="+3 new this week"
        />
        <StatCard
          icon="check"
          label="API Health"
          value="99.8%"
          color="success"
          percentage={99}
          hint="All systems normal"
        />
      </div>

      {/* Charts + Activity */}
      <div className="content-grid grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Activity Chart */}
        <Card className="flex flex-col h-full">
          <Card.Header className="flex items-center justify-between">
            <div>
              <Card.Title>Weekly Activity</Card.Title>
              <Card.Subtitle>API requests & events this week</Card.Subtitle>
            </div>
            <Badge variant="success" dot>Live</Badge>
          </Card.Header>
          <Card.Body className="flex-1 flex flex-col justify-center py-6">
            <WeeklyChart data={stats.weeklyData} />
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
            <QuickActionCard icon="building" label="New Org" color="primary" href="/organizations" />
            <QuickActionCard icon="folder-open" label="New Project" color="accent" href="/projects" />
            <QuickActionCard icon="flag" label="New Feature" color="success" href="/features" />
            <QuickActionCard icon="shield" label="New Role" color="violet" href="/roles" />
            <QuickActionCard icon="users" label="Manage Users" color="warning" href="/profile" />
            <QuickActionCard icon="key" label="Permissions" color="danger" href="/permissions" />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
