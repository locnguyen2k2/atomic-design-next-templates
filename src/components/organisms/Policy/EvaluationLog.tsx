"use client";

import React from "react";
import { Card } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Badge } from "@/components/atoms/Badge";
import { StatCard } from "@/components/atoms/StatCard";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EvaluationLogProps {
  logs: any[];
}

export function EvaluationLog({ logs }: EvaluationLogProps) {
  const allowCount = logs.filter((l) => l.result === "ALLOW").length;
  const denyCount = logs.filter((l) => l.result === "DENY").length;
  const avgLatency = logs.length > 0 ? Math.round(logs.reduce((acc, curr) => acc + curr.duration_ms, 0) / logs.length) : 0;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="circle-check" label="Allow Decisions" value={allowCount} color="success" />
        <StatCard icon="circle-xmark" label="Deny Decisions" value={denyCount} color="danger" />
        <StatCard icon="clock" label="Avg Latency" value={`${avgLatency}ms`} color="primary" />
        <StatCard icon="list" label="Total Evaluated" value={logs.length} color="violet" />
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-bg-subtle/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center text-violet">
              <Icon name="list-check" size="sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Policy Evaluation Log</h3>
              <p className="text-[11px] text-text-muted">Real-time access decision audit trail</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="h-8 text-xs gap-1.5" onClick={() => {}}>
            <Icon name="download" size="md" /> Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-elevated/30">
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Timestamp</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Subject</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Action</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Resource</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Decision</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Policy</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-text-muted text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-text-muted text-sm">
                    No evaluation logs found. Run the evaluator to generate logs.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-bg-hover/30 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-[11px] font-mono text-text-muted">{format(new Date(log.ts), "HH:mm:ss.SSS")}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-bold text-text-primary">{log.subject}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <Badge variant="muted" className="text-[10px] font-mono">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-[11px] font-mono text-text-secondary">{log.resource}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${log.result === "ALLOW" ? "text-success" : "text-danger"}`}>
                        <Icon name={log.result === "ALLOW" ? "circle-check" : "circle-xmark"} size="md" />
                        {log.result}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-[10px] bg-bg-subtle px-2 py-1 rounded text-text-muted border border-border/50">{log.policy}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right text-[11px] font-mono text-text-muted">{log.duration_ms}ms</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Architecture Info */}
      <Card className="p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Icon name="diagram-project" size="sm" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">ABAC Architecture</h3>
            <p className="text-[11px] text-text-muted">How the policy decision engine evaluates access requests</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-9 gap-4 items-center">
          <ArchStep icon="user" title="Subject" desc="role, dept, clearance, mfa" color="primary" />
          <div className="hidden md:flex justify-center text-text-muted opacity-30">
            <Icon name="plus" size="sm" />
          </div>
          <ArchStep icon="database" title="Resource" desc="type, sensitivity, owner" color="accent" />
          <div className="hidden md:flex justify-center text-text-muted opacity-30">
            <Icon name="plus" size="sm" />
          </div>
          <ArchStep icon="bolt" title="Action" desc="create, read, update, delete" color="warning" />
          <div className="hidden md:flex justify-center text-text-muted opacity-30">
            <Icon name="plus" size="sm" />
          </div>
          <ArchStep icon="cloud" title="Environment" desc="time, network, risk score" color="violet" />
          <div className="hidden md:flex justify-center text-text-muted opacity-50">
            <Icon name="arrow-right-from-bracket" size="md" />
          </div>
          <ArchStep icon="scale-balanced" title="PDP Engine" desc="evaluates & decides" color="success" />
        </div>
      </Card>
    </div>
  );
}

function ArchStep({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) {
  const colorMap: any = {
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    violet: "bg-violet/10 text-violet border-violet/20",
    success: "bg-success/10 text-success border-success/20",
  };

  return (
    <div className="md:col-span-1 flex flex-col items-center text-center space-y-2 min-w-[120px]">
      <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center mb-1 shadow-sm", colorMap[color])}>
        <Icon name={icon as any} size="md" />
      </div>
      <div className="text-xs font-black text-text-primary uppercase tracking-wider">{title}</div>
      <div className="text-[10px] text-text-muted leading-tight px-2">{desc}</div>
    </div>
  );
}
