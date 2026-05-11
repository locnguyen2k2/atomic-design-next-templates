"use client";

import React from "react";
import { usePolicy } from "@/hooks/usePolicy";
import { PolicyList } from "@/components/templates/ListPageTemplate/PolicyList";
import { AttributeList } from "@/components/organisms/Policy/AttributeList";
import { PolicyEvaluator, PolicyDrawer } from "@/components/molecules/PolicyForm";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { StatCard } from "@/components/atoms/StatCard";
import { cn } from "@/lib/utils";
import { EvaluationLog } from "@/components/organisms/Policy/EvaluationLog";

export default function PolicyPage() {
  const {
    metadata,
    policies,
    isLoading,
    pagination,
    activeTab,
    setActiveTab,
    policyFilter,
    setPolicyFilter,
    policySearch,
    setPolicySearch,
    dateRange,
    setDateRange,
    onSort,
    setPage,
    isAttrsLoading,
    attrPagination,
    attrSearch,
    setAttrSearch,
    attrDateRange,
    setAttrDateRange,
    onAttrSort,
    setAttrPage,
    isDrawerOpen,
    selectedPolicy,
    openDrawer,
    closeDrawer,
    savePolicy,
    deletePolicy,
    evalForm,
    updateEvalForm,
    evalResult,
    setEvalResult,
    runEvaluation,
    evalLog,
  } = usePolicy();

  const tabs = [
    { id: "policies", label: "Policies", icon: "scroll" },
    { id: "attributes", label: "Attributes", icon: "tags" },
    { id: "evaluator", label: "Policy Evaluator", icon: "flask" },
    { id: "logs", label: "Evaluation Log", icon: "list-check" },
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="page-header-info">
          <h1 className="page-title flex items-center gap-3 text-3xl font-bold text-text-primary tracking-tight">
            <span className="text-primary">
              <Icon name="key" />
            </span>
            Permissions
            <Badge variant="primary" className="ml-2 font-mono text-[10px] uppercase tracking-widest px-2 py-0.5">
              ABAC
            </Badge>
          </h1>
          <p className="page-subtitle text-text-muted mt-1.5 text-sm max-w-2xl">Attribute-Based Access Control — define fine-grained policies using subject, resource, action, and context attributes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="h-10 font-bold gap-2">
            <Icon name="arrows-rotate" size="sm" /> Refresh
          </Button>
          <Button size="sm" className="h-10 font-bold gap-2" onClick={() => openDrawer()}>
            <Icon name="plus" size="sm" /> New Policy
          </Button>
        </div>
      </div>

      {/* Stats Quick Overview */}
      <div className="stats-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon="scroll" label="Total Policies" value={pagination.totalItems} color="primary" percentage={78} trend="+2 this month" />
        <StatCard icon="plus-circle" label="Allow Rules" value={policies.filter((p) => p.effect === "ALLOW").length} color="success" percentage={85} trend="Permissive" />
        <StatCard icon="circle-xmark" label="Deny Rules" value={policies.filter((p) => p.effect === "DENY").length} color="danger" percentage={45} trend="Security" />
        <StatCard icon="user-tag" label="Subject Attrs" value={metadata.subjectAttributes.length} color="violet" percentage={72} trend="Rich context" />
        <StatCard icon="database" label="Resource Attrs" value={metadata.resourceAttributes.length} color="warning" percentage={60} trend="Granular" />
      </div>

      {/* Tabs Navigation */}
      <div className="abac-tabs-bar flex gap-1 p-1 bg-bg-elevated rounded-lg border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn("abac-tab flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-semibold transition-all", activeTab === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "text-text-secondary hover:text-text-primary hover:bg-bg-hover")}
          >
            <Icon name={tab.icon as any} size="sm" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "policies" && (
          <PolicyList
            policies={policies}
            isLoading={isLoading}
            pagination={pagination}
            filter={policyFilter}
            onFilterChange={setPolicyFilter}
            search={policySearch}
            onSearchChange={setPolicySearch}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onPageChange={setPage}
            onSort={onSort}
            onDelete={deletePolicy}
            onEdit={openDrawer}
            onDuplicate={(p) => openDrawer({ ...p, id: "", name: `${p.name} (Copy)` })}
            onCreate={() => openDrawer()}
          />
        )}

        {activeTab === "attributes" && (
          <AttributeList
            subjectAttributes={metadata.subjectAttributes}
            resourceAttributes={metadata.resourceAttributes}
            environmentAttributes={metadata.environmentAttributes}
            isLoading={isAttrsLoading}
            search={attrSearch}
            onSearch={setAttrSearch}
            dateRange={attrDateRange}
            onDateRangeChange={setAttrDateRange}
            onSort={onAttrSort}
            pagination={attrPagination}
            onPageChange={setAttrPage}
          />
        )}

        {activeTab === "evaluator" && (
          <div className="animate-fade-up">
            <PolicyEvaluator evalForm={evalForm} updateEvalForm={updateEvalForm} runEvaluation={runEvaluation} evalResult={evalResult} setEvalResult={setEvalResult} metadata={metadata} />
          </div>
        )}

        {activeTab === "logs" && (
          <div className="animate-fade-up">
            <EvaluationLog logs={evalLog} />
          </div>
        )}
      </div>

      {/* Policy Drawer */}
      <PolicyDrawer isOpen={isDrawerOpen} onClose={closeDrawer} onSave={savePolicy} policy={selectedPolicy} />
    </div>
  );
}
