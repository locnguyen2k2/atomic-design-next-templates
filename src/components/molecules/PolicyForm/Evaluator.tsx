"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";
import { Attribute } from "@/types/abac";
import { SelectWithCursor } from "@/components/molecules/SelectWithCursor";
import { useClearancesCursor, useSubscriptionsCursor, useEnvironmentsCursor, useDepartmentsCursor, useOrganizationsCursor, useProjectsCursor, useFeaturesCursor, useResourceTypesCursor, useRolesCursor } from "@/hooks";

interface PolicyEvaluatorProps {
  evalForm: any;
  updateEvalForm: (key: string, value: any) => void;
  runEvaluation: () => void;
  evalResult: any;
  setEvalResult: (res: any) => void;
  metadata: {
    subjectAttributes: Attribute[];
    resourceAttributes: Attribute[];
    environmentAttributes: Attribute[];
    actions: string[];
  };
}

export function PolicyEvaluator({ evalForm, updateEvalForm, runEvaluation, evalResult, setEvalResult, metadata }: PolicyEvaluatorProps) {
  const [clearanceSearch, setClearanceSearch] = useState("");
  const [subscriptionSearch, setSubscriptionSearch] = useState("");
  const [environmentSearch, setEnvironmentSearch] = useState("");
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [organizationSearch, setOrganizationSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [featureSearch, setFeatureSearch] = useState("");
  const [resourceTypeSearch, setResourceTypeSearch] = useState("");

  const { data: clearancePages, fetchNextPage: fetchNextClearance, hasNextPage: hasNextClearance, isFetchingNextPage: isFetchingNextClearance, isLoading: isClearancesLoading } = useClearancesCursor({ keyword: clearanceSearch });
  const { data: subscriptionPages, fetchNextPage: fetchNextSubscription, hasNextPage: hasNextSubscription, isFetchingNextPage: isFetchingNextSubscription, isLoading: isSubscriptionsLoading } = useSubscriptionsCursor({ keyword: subscriptionSearch });
  const { data: environmentPages, fetchNextPage: fetchNextEnvironment, hasNextPage: hasNextEnvironment, isFetchingNextPage: isFetchingNextEnvironment, isLoading: isEnvironmentsLoading } = useEnvironmentsCursor({ keyword: environmentSearch });
  const { data: departmentPages, fetchNextPage: fetchNextDepartment, hasNextPage: hasNextDepartment, isFetchingNextPage: isFetchingNextDepartment, isLoading: isDepartmentsLoading } = useDepartmentsCursor({ keyword: departmentSearch });
  const { data: rolePages, fetchNextPage: fetchNextRole, hasNextPage: hasNextRole, isFetchingNextPage: isFetchingNextRole, isLoading: isRolesLoading } = useRolesCursor({ keyword: roleSearch, organizationId: evalForm.resource_org });
  const { data: organizationPages, fetchNextPage: fetchNextOrganization, hasNextPage: hasNextOrganization, isFetchingNextPage: isFetchingNextOrganization, isLoading: isOrganizationsLoading } = useOrganizationsCursor({ keyword: organizationSearch });
  const { data: projectPages, fetchNextPage: fetchNextProject, hasNextPage: hasNextProject, isFetchingNextPage: isFetchingNextProject, isLoading: isProjectsLoading } = useProjectsCursor({ keyword: projectSearch, organizationId: evalForm.resource_org });
  const { data: featurePages, fetchNextPage: fetchNextFeature, hasNextPage: hasNextFeature, isFetchingNextPage: isFetchingNextFeature, isLoading: isFeaturesLoading } = useFeaturesCursor({ keyword: featureSearch, organizationId: evalForm.resource_org, projectId: evalForm.resource_project });
  const { data: resourceTypePages, fetchNextPage: fetchNextResourceType, hasNextPage: hasNextResourceType, isFetchingNextPage: isFetchingNextResourceType, isLoading: isResourceTypesLoading } = useResourceTypesCursor({ keyword: resourceTypeSearch });

  const clearances = useMemo(() => clearancePages?.pages.flatMap((page) => page.data) || [], [clearancePages]);
  const subscriptions = useMemo(() => subscriptionPages?.pages.flatMap((page) => page.data) || [], [subscriptionPages]);
  const environments = useMemo(() => environmentPages?.pages.flatMap((page) => page.data) || [], [environmentPages]);
  const departments = useMemo(() => departmentPages?.pages.flatMap((page) => page.data) || [], [departmentPages]);
  const roles = useMemo(() => rolePages?.pages.flatMap((page) => page.data) || [], [rolePages]);
  const organizations = useMemo(() => organizationPages?.pages.flatMap((page) => page.data) || [], [organizationPages]);
  const projects = useMemo(() => projectPages?.pages.flatMap((page) => page.data) || [], [projectPages]);
  const features = useMemo(() => featurePages?.pages.flatMap((page) => page.data).map((f) => ({ id: f.id, name: f.name })) || [], [featurePages]);
  const resourceTypes = useMemo(() => resourceTypePages?.pages.flatMap((page) => page.data).map((rt) => ({ id: rt.slug, name: rt.name })) || [], [resourceTypePages]);
  const handleOrgChange = (orgId: string) => {
    updateEvalForm("resource_org", orgId);
    updateEvalForm("resource_project", "");
    updateEvalForm("resource_feature", "");
  };

  const handleResourceTypeChange = (resourceTypeId: string) => {
    updateEvalForm("resource_type", resourceTypeId);
  };

  const handleProjectChange = (projectId: string) => {
    updateEvalForm("resource_project", projectId);
  };

  const renderSelect = (key: string, label: string, options: string[], value: string) => (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{label}</label>
      <select value={value} onChange={(e) => updateEvalForm(key, e.target.value)} className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  const renderInput = (key: string, label: string, placeholder: string, value: string) => (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => updateEvalForm(key, e.target.value)}
        className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Input Panel */}
      <div className="policy-attributes lg:col-span-5 space-y-6">
        <Card className="border-primary/10">
          <div className="px-5 py-4 border-b border-border bg-bg-subtle rounded-t-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="user-tag" size="sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Subject Attributes</h3>
              <p className="text-[11px] text-text-muted">Who is making the request?</p>
            </div>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectWithCursor
              label="Role"
              placeholder="Select Role"
              items={roles}
              isLoading={isRolesLoading || isFetchingNextRole}
              hasMore={!!hasNextRole}
              onLoadMore={() => fetchNextRole()}
              onSearch={(query) => setRoleSearch(query)}
              onSelect={(item) => updateEvalForm("subject_role", item.id)}
              selectedId={evalForm.subject_role}
            />
            <SelectWithCursor
              label="Department"
              placeholder="Select Department"
              items={departments}
              isLoading={isDepartmentsLoading || isFetchingNextDepartment}
              hasMore={!!hasNextDepartment}
              onLoadMore={() => fetchNextDepartment()}
              onSearch={(query) => setDepartmentSearch(query)}
              onSelect={(item) => updateEvalForm("subject_dept", item.id)}
              selectedId={evalForm.subject_dept}
            />
            <SelectWithCursor
              label="Clearance"
              placeholder="Select Clearance"
              items={clearances}
              isLoading={isClearancesLoading || isFetchingNextClearance}
              hasMore={!!hasNextClearance}
              onLoadMore={() => fetchNextClearance()}
              onSearch={(query) => setClearanceSearch(query)}
              onSelect={(item) => updateEvalForm("subject_clearance", item.id)}
              selectedId={evalForm.subject_clearance}
            />
            {renderSelect("subject_mfa", "MFA Verified", ["true", "false"], evalForm.subject_mfa)}
            <SelectWithCursor
              label="Subscription"
              placeholder="Select Subscription"
              items={subscriptions}
              isLoading={isSubscriptionsLoading || isFetchingNextSubscription}
              hasMore={!!hasNextSubscription}
              onLoadMore={() => fetchNextSubscription()}
              onSearch={(query) => setSubscriptionSearch(query)}
              onSelect={(item) => updateEvalForm("subject_subscription", item.id)}
              selectedId={evalForm.subject_subscription}
            />
            {renderInput("subject_location", "Location", "e.g. US, EU", evalForm.subject_location)}
          </div>
        </Card>

        <Card className="border-accent/10">
          <div className="px-5 py-4 border-b border-border bg-bg-subtle rounded-t-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Icon name="database" size="sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Resource Attributes</h3>
              <p className="text-[11px] text-text-muted">What is being accessed?</p>
            </div>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectWithCursor
              label="Resource Type"
              placeholder="Select Resource Type"
              items={resourceTypes}
              isLoading={isResourceTypesLoading || isFetchingNextResourceType}
              hasMore={!!hasNextResourceType}
              onLoadMore={() => fetchNextResourceType()}
              onSearch={(query) => setResourceTypeSearch(query)}
              onSelect={(item) => handleResourceTypeChange(item.id)}
              selectedId={evalForm.resource_type}
            />
            <SelectWithCursor
              label="Organization"
              placeholder="Select Organization"
              items={organizations}
              isLoading={isOrganizationsLoading || isFetchingNextOrganization}
              hasMore={!!hasNextOrganization}
              onLoadMore={() => fetchNextOrganization()}
              onSearch={(query) => setOrganizationSearch(query)}
              onSelect={(item) => handleOrgChange(item.id)}
              selectedId={evalForm.resource_org}
            />
            {evalForm.resource_type === "project" || evalForm.resource_type === "feature" ? (
              <SelectWithCursor
                label="Project"
                placeholder="Select Project"
                items={projects}
                isLoading={isProjectsLoading || isFetchingNextProject}
                hasMore={!!hasNextProject}
                onLoadMore={() => fetchNextProject()}
                onSearch={(query) => setProjectSearch(query)}
                onSelect={(item) => handleProjectChange(item.id)}
                selectedId={evalForm.resource_project}
              />
            ) : (
              <></> 
            )}
            {evalForm.resource_type === "feature" && (
              <SelectWithCursor
                label="Feature"
                placeholder="Select Feature"
                items={features}
                isLoading={isFeaturesLoading || isFetchingNextFeature}
                hasMore={!!hasNextFeature}
                onLoadMore={() => fetchNextFeature()}
                onSearch={(query) => setFeatureSearch(query)}
                onSelect={(item) => updateEvalForm("resource_feature", item.id)}
                selectedId={evalForm.resource_feature}
              />
            )}
            {renderSelect("resource_sensitivity", "Sensitivity", ["public", "internal", "confidential"], evalForm.resource_sensitivity)}
            <SelectWithCursor
              label="Environment"
              placeholder="Select Environment"
              items={environments}
              isLoading={isEnvironmentsLoading || isFetchingNextEnvironment}
              hasMore={!!hasNextEnvironment}
              onLoadMore={() => fetchNextEnvironment()}
              onSearch={(query) => setEnvironmentSearch(query)}
              onSelect={(item) => updateEvalForm("resource_env", item.id)}
              selectedId={evalForm.resource_env}
            />
            {renderInput("resource_owner", "User ID", "e.g. user-001", evalForm.resource_owner)}
          </div>
        </Card>

        <Card className="border-warning/10">
          <div className="px-5 py-4 border-b border-border bg-bg-subtle rounded-t-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
              <Icon name="bolt" size="sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Action & Context</h3>
              <p className="text-[11px] text-text-muted">What action and context?</p>
            </div>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderSelect("action", "Action", metadata.actions, evalForm.action)}
            {renderSelect("env_network", "Network", ["Public", "VPN", "Office"], evalForm.env_network)}
            {renderInput("env_risk", "Risk Score", "0-100", evalForm.env_risk)}
          </div>
        </Card>

        <Button className="w-full h-12 text-sm font-bold gap-2 shadow-lg shadow-primary/20" onClick={runEvaluation}>
          <Icon name="flask" /> Evaluate Policy Decision
        </Button>
      </div>

      {/* Result Panel */}
      <div className="lg:col-span-7 h-full">
        <Card className="h-full min-h-[600px] flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center text-violet">
                <Icon name="scale-balanced" size="sm" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">Decision Engine Output</h3>
                <p className="text-[11px] text-text-muted">Real-time ABAC evaluation result</p>
              </div>
            </div>
            {evalResult && (
              <Button variant="ghost" size="sm" onClick={() => setEvalResult(null)} className="h-8 text-xs gap-1.5">
                <Icon name="xmark" size={"md"} /> Clear
              </Button>
            )}
          </div>

          <div className="flex-1 p-6">
            {!evalResult ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Icon name="flask" size="lg" className="text-text-muted" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-text-primary">Ready to Evaluate</h4>
                  <p className="text-sm text-text-muted max-w-[240px] mt-1">Configure attributes on the left and click evaluate to see the engine decision.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-up">
                {/* Result Hero */}
                <div className={cn("p-6 rounded-2xl border-2 flex flex-col items-center text-center space-y-3", evalResult.decision === "ALLOW" ? "bg-success/5 border-success/20 text-success" : "bg-danger/5 border-danger/20 text-danger")}>
                  <div className={cn("w-16 h-16 rounded-full flex items-center justify-center shadow-inner", evalResult.decision === "ALLOW" ? "bg-success/10" : "bg-danger/10")}>
                    <Icon name={evalResult.decision === "ALLOW" ? "circle-check" : "circle-xmark"} size="lg" />
                  </div>
                  <div className="text-3xl font-black tracking-tighter">{evalResult.decision}</div>
                  <p className="text-sm font-medium opacity-80 max-w-md">{evalResult.reason}</p>
                </div>

                {/* Matched Policies */}
                {evalResult.matchedPolicies.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted px-1">
                      <Icon name="list-check" size={"md"} /> Evaluated Policies ({evalResult.matchedPolicies.length})
                    </div>
                    <div className="space-y-2">
                      {evalResult.matchedPolicies.map((p: any) => (
                        <div key={p.id} className={cn("flex items-center justify-between p-3 rounded-xl border transition-all", p.applied ? (p.effect === "ALLOW" ? "bg-success/10 border-success/30" : "bg-danger/10 border-danger/30") : "bg-bg-elevated border-border opacity-60")}>
                          <div className="flex items-center gap-3">
                            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold", p.effect === "ALLOW" ? "bg-success/20 text-success" : "bg-danger/20 text-danger")}>
                              <Icon name={p.effect === "ALLOW" ? "check" : "xmark"} size={"md"} />
                            </div>
                            <span className="text-sm font-bold text-text-primary">{p.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono bg-bg-subtle px-2 py-1 rounded text-text-muted">P{p.priority || 50}</span>
                            {p.applied && <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1 rounded">Applied</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Context */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted px-1">
                    <Icon name="info-circle" size={"md"} /> Evaluation Context
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(evalResult.context).map(([k, v]: [string, any]) => (
                      <div key={k} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-subtle border border-border/50">
                        <span className="text-[11px] font-mono text-text-muted">{k}</span>
                        <span className="text-[11px] font-bold text-text-primary">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
