"use client";

import React from "react";
import { ListPageTemplate } from "@/components/templates/ListPageTemplate/ListPageTemplate";
import { useSystemLogs } from "@/hooks/useSystemLogs";
import { Badge } from "@/components/atoms/Badge";
import { type SystemLog } from "@/types";

export default function LogsPage() {
  const { logs, paginated, isLoading, setPage, setSearch, setDateRange } = useSystemLogs();

  const columns = [
    {
      key: "created_at",
      label: "Time",
      render: (row: SystemLog) => (
        <span className="text-xs text-text-muted font-mono">
          {new Date(row.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row: SystemLog) => (
        <Badge variant={getActionVariant(row.action)} className="uppercase text-[10px]">
          {row.action}
        </Badge>
      ),
    },
    {
      key: "entity",
      label: "Entity",
      render: (row: SystemLog) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">{row.entity}</span>
          <span className="text-[10px] text-text-muted font-mono">{row.entity_id}</span>
        </div>
      ),
    },
    {
      key: "user_name",
      label: "User",
      render: (row: SystemLog) => (
        <div className="flex flex-col">
          <span className="text-sm text-text-primary">{row.created_by ? `${row.attributes ? row.attributes.find(({key}) => key === 'email')?.value : ''}` : "System"}</span>
          <span className="text-[10px] text-text-muted font-mono">{row.ip_address}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <ListPageTemplate
        title="System Logs"
        subtitle="Audit trail of all actions performed in the system"
        icon="scroll"
        color="primary"
        data={logs as any}
        columns={columns as any}
        keyField="id"
        isLoading={isLoading}
        onSearch={setSearch}
        enableDateRangeFilter
        onDateRangeChange={(range) => setDateRange(range.from?.toISOString(), range.to?.toISOString())}
      />
    </div>
  );
}

function getActionVariant(action: string): "primary" | "success" | "warning" | "danger" | "muted" {
  const a = action.toLowerCase();
  if (a.includes("create") || a.includes("add")) return "success";
  if (a.includes("update") || a.includes("edit")) return "primary";
  if (a.includes("delete") || a.includes("remove")) return "danger";
  if (a.includes("login") || a.includes("auth")) return "warning";
  return "muted";
}
