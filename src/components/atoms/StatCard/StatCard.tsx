import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: "primary" | "accent" | "success" | "warning" | "violet" | "danger";
  percentage?: number;
  trend?: string;
  trendDirection?: "up" | "down";
}

export const StatCard = ({ icon, label, value, color, percentage, trend, trendDirection = "up" }: StatCardProps) => {
  return (
    <div className="stat-card bg-card border border-border rounded-xl p-4 shadow-sm relative overflow-hidden transition-all hover:border-border hover:shadow-md hover:-translate-y-[2px]">
      <div className="stat-card-header flex items-center justify-between mb-3.5">
        <div className={cn("stat-card-icon w-10 h-10 rounded-lg flex items-center justify-center", `bg-${color}/10 text-${color}`)}>
          <Icon name={icon as any} size="sm" />
        </div>
        {trend && (
          <span className={cn("stat-card-trend flex items-center gap-1 text-xs font-semibold", trendDirection === "up" ? "text-success" : "text-danger")}>
            <Icon name={trendDirection === "up" ? "trend-up" : "trend-up"} size="sm" className={trendDirection === "down" ? "rotate-180" : ""} />
            {trend}
          </span>
        )}
      </div>
      <div className="stat-card-value text-2xl font-extrabold text-text-primary font-variant-numeric: tabular-nums">{value}</div>
      <div className="stat-card-label text-xs text-text-muted font-medium">{label}</div>
      {percentage !== undefined && (
        <div className="stat-card-bar h-[3px] bg-bg-hover rounded-full mt-3 overflow-hidden">
          <div className="stat-card-bar-fill h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${percentage}%` }} />
        </div>
      )}
    </div>
  );
};
