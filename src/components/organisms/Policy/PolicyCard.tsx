import React from "react";
import { AbacPolicy } from "@/types/abac";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";

interface PolicyCardProps {
  policy: AbacPolicy;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSimulate?: (id: string) => void;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy, onEdit, onDuplicate, onDelete, onSimulate }) => {
  const isAllow = policy.effect === "ALLOW";

  const getActionColor = (action: string) => {
    const map: Record<string, string> = {
      CREATE: "success",
      READ: "primary",
      UPDATE: "warning",
      DELETE: "danger",
      MANAGE: "violet",
      "*": "danger",
    };
    return map[action.toUpperCase()] || "secondary";
  };

  return (
    <div className={cn("abac-policy-card bg-card border border-border rounded-xl p-4 relative transition-all hover:border-border hover:shadow-md hover:-translate-y-[1px]", isAllow ? "abac-policy-card--allow" : "abac-policy-card--deny")}>
      {/* Selection border indicator */}
      <div className={cn("absolute top-0 left-0 w-1 h-full", isAllow ? "bg-success" : "bg-danger")} />

      {/* Header */}
      <div className="abac-policy-card-header flex items-center gap-3.5 pb-3.5 border-b border-border flex-wrap">
        <div
          className={cn(
            "abac-policy-effect-indicator flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase border",
            isAllow ? "abac-policy-effect-indicator--allow bg-success/10 text-success border-success/20" : "abac-policy-effect-indicator--deny bg-danger/10 text-danger border-danger/20",
          )}
        >
          <Icon name={isAllow ? "circle-check" : "circle-xmark"} size={"sm"} />
          {policy.effect}
        </div>

        <div className="abac-policy-title-group flex-1 min-w-0">
          <h3 className="abac-policy-name text-sm font-bold text-text-primary">{policy.name}</h3>
          <p className="abac-policy-desc text-xs text-text-muted mt-0.5">{policy.description}</p>
        </div>

        <div className="abac-policy-meta-right flex items-center gap-2">
          <div className="abac-policy-actions flex gap-0.5 ml-2">
            <Button variant="ghost" size={"sm"} className="h-8 w-8 p-0 text-text-muted hover:text-text-primary" onClick={() => onEdit?.(policy.id)}>
              <Icon name="pen" size={"sm"} />
            </Button>
            <Button variant="ghost" size={"sm"} className="h-8 w-8 p-0 text-text-muted hover:text-text-primary" onClick={() => onDuplicate?.(policy.id)}>
              <Icon name="copy" size={"sm"} />
            </Button>
            <Button variant="ghost" size={"sm"} className="h-8 w-8 p-0 text-text-muted hover:text-danger" onClick={() => onDelete?.(policy.id)}>
              <Icon name="trash" size={"sm"} />
            </Button>
          </div>
        </div>
      </div>

      {/* Body - Attributes Grid */}
      <div className="abac-policy-card-body px-4 py-4 border-y border-border/30 grid grid-cols-3 gap-0">
        {/* Action Block */}
        <div className="abac-policy-block px-5 py-3.5 border-r border-border/30">
          <div className="abac-policy-block-label flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            <Icon name="bolt" size={"sm"} /> Action
          </div>
          <div className="abac-action-badges flex flex-wrap gap-1.5 mt-2">
            {(() => {
              const a = policy.action;
              const color = getActionColor(a);
              return (
                <span
                  key={a}
                  className={cn(
                    "abac-action-badge px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border shadow-sm",
                    color === "success" && "bg-success/10 text-success border-success/20",
                    color === "primary" && "bg-primary/10 text-primary border-primary/20",
                    color === "warning" && "bg-warning/10 text-warning border-warning/20",
                    color === "danger" && "bg-danger/10 text-danger border-danger/20",
                    color === "violet" && "bg-violet/10 text-violet border-violet/20",
                    color === "secondary" && "bg-secondary/50 text-text-secondary border-border",
                  )}
                >
                  {a}
                </span>
              );
            })()}
          </div>
        </div>

        {/* Resource Block */}
        <div className="abac-policy-block px-5 py-3.5 border-r border-border/30">
          <div className="abac-policy-block-label flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            <Icon name="database" size={"sm"} /> Resource
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-medium border shadow-sm bg-accent/10 text-accent border-accent/20">
              <Icon name="database" size={"sm"} />
              <strong className="text-text-primary">{policy.resource}</strong>
            </span>
          </div>
        </div>

        {/* Condition Block */}
        <div className="abac-policy-block px-5 py-3.5">
          <div className="abac-policy-block-label flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            <Icon name="filter" size={"sm"} /> Condition
          </div>
          <div className="mt-2">
            {policy.condition && Object.keys(policy.condition).length > 0 ? (
              <div className="text-[10px] font-mono text-text-muted bg-secondary/10 p-1.5 rounded border border-border/50 truncate max-w-full">
                {JSON.stringify(policy.condition)}
              </div>
            ) : (
              <span className="text-[11px] text-text-muted italic">No conditions</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="abac-policy-card-footer flex items-center justify-between px-4 py-2.5 bg-secondary/10 border-t border-border/10 flex-wrap gap-2">
        <div className="flex items-center gap-4 text-[10px] text-text-muted font-medium">
          <span className="flex items-center gap-1.5 hover:text-text-secondary cursor-default transition-colors">
            <Icon name="id-badge" size={"sm"} /> {policy.id}
          </span>
          <span className="flex items-center gap-1.5 hover:text-text-secondary cursor-default transition-colors">
            <Icon name="building" size={"sm"} /> {policy.organization_id || "No Org"}
          </span>
          <span className="flex items-center gap-1.5 hover:text-text-secondary cursor-default transition-colors">
            <Icon name="calendar-days" size={"sm"} /> {new Date(policy.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <Button variant="ghost" size={"sm"} className="abac-simulate-btn h-7 px-3 text-[10px] font-bold text-violet bg-violet/5 hover:bg-violet/10 border border-violet/20 gap-2 transition-all ml-auto" onClick={() => onSimulate?.(policy.id)}>
          <Icon name="flask" size={"sm"} /> Simulate
        </Button>
      </div>
    </div>
  );
};
