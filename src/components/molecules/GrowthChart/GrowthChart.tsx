"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

export type ChartType = "pie" | "column" | "line";

interface GrowthChartProps {
  data?: {
    labels: string[];
    values: number[];
  };
  min?: { label: string; value: number };
  max?: { label: string; value: number };
  type: ChartType;
  title?: string;
  className?: string;
}

export function GrowthChart({ data, min, max, type, title, className }: GrowthChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [data, type]);

  const chartData = useMemo(() => {
    if (!data || !data.labels || !data.values) return [];

    // Check if we should show time (if all dates are the same)
    const dates = data.labels.map((l) => new Date(l).toDateString());
    const allSameDate = dates.length > 0 && dates.every((d) => d === dates[0]);

    return data.labels.map((label, i) => {
      const date = new Date(label);
      let formattedLabel = date.toLocaleDateString([], { month: "short", day: "numeric" });

      if (allSameDate) {
        formattedLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      }

      return {
        label: formattedLabel,
        value: data.values[i],
        originalLabel: label,
      };
    });
  }, [data]);

  const maxValue = useMemo(() => {
    if (max?.value !== undefined) return max.value > 0 ? max.value : 5;
    if (chartData.length === 0) return 0;
    const m = Math.max(...chartData.map((d) => d.value));
    return m > 5 ? m * 1.2 : 5;
  }, [chartData, max]);

  if (!data || chartData.length === 0) {
    return <div className={cn("flex items-center justify-center h-48 text-text-muted text-sm", className)}>No data available</div>;
  }

  const renderColumn = () => (
    <div className="flex items-end justify-between gap-2 h-48 px-2 pt-4">
      {chartData.map((item, i) => {
        const percentage = (item.value / maxValue) * 100;
        const heightPercent = item.value > 0 ? Math.max(percentage, 2) : 0;

        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
            <div className="relative w-full h-full bg-bg-surface rounded-t-lg overflow-hidden">
              <div className={cn("absolute bottom-0 left-0 right-0 bg-primary/80 group-hover:bg-primary transition-all duration-1000 ease-out rounded-t-md", !animated && "h-0")} style={{ height: animated ? `${heightPercent}%` : "0%" }} />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-[10px] font-mono bg-bg-elevated text-text-primary px-1 rounded border border-border shadow-sm">{item.value}</span>
              </div>
            </div>
            <div className="text-[10px] font-medium text-text-muted truncate w-full text-center">{item.label}</div>
          </div>
        );
      })}
    </div>
  );

  const renderLine = () => {
    const width = 400;
    const height = 192;
    const padding = 20;

    if (chartData.length === 1) {
      const x = width / 2;
      const y = height - ((chartData[0].value / maxValue) * (height - padding * 2) + padding);
      return (
        <div className="relative h-48">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <circle cx={x} cy={y} r="6" className={cn("fill-primary stroke-bg-surface stroke-2 transition-all duration-500", !animated && "opacity-0")} />
          </svg>
          <div className="flex justify-center mt-2">
            <div className="text-[10px] text-text-muted">{chartData[0].label}</div>
          </div>
        </div>
      );
    }

    const points = chartData
      .map((item, i) => {
        const x = (i / (chartData.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((item.value / maxValue) * (height - padding * 2) + padding);
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="relative h-48">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} className="stroke-border/30" strokeDasharray="4 4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="stroke-border/30" />

          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("text-primary transition-all duration-1000 ease-out", !animated && "opacity-0")}
            points={points}
            style={{
              strokeDasharray: "1000",
              strokeDashoffset: animated ? "0" : "1000",
              transition: "stroke-dashoffset 1.5s ease-in-out, opacity 0.5s",
            }}
          />
          {chartData.map((item, i) => {
            const x = (i / (chartData.length - 1)) * (width - padding * 2) + padding;
            const y = height - ((item.value / maxValue) * (height - padding * 2) + padding);
            return (
              <g key={i} className="group">
                <circle cx={x} cy={y} r="4" className={cn("fill-primary stroke-bg-surface stroke-2 transition-all duration-500", !animated && "opacity-0")} style={{ transitionDelay: `${(i / chartData.length) * 1000}ms` }} />
                <foreignObject x={x - 20} y={y - 30} width="40" height="25" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="text-[10px] font-mono text-center bg-bg-elevated text-text-primary rounded border border-border shadow-sm px-1">{item.value}</div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
        <div className="flex justify-between mt-2 px-1">
          {chartData.map((item, i) => {
            // Show at most 6 labels
            if (chartData.length > 6 && i % Math.ceil(chartData.length / 6) !== 0 && i !== chartData.length - 1) return null;
            return (
              <div key={i} className="text-[10px] text-text-muted font-medium">
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPie = () => {
    const total = chartData.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = 0;
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    const colors = [
      "#6366f1", // primary
      "#06b6d4", // accent
      "#10b981", // success
      "#f59e0b", // warning
      "#8b5cf6", // violet
      "#ef4444", // danger
    ];

    return (
      <div className="flex items-center justify-center h-48 gap-8 px-4">
        <svg viewBox="0 0 200 200" className="w-40 h-40 overflow-visible">
          {total === 0 ? (
            <circle cx={centerX} cy={centerY} r={radius} className="fill-bg-surface stroke-border stroke-1" />
          ) : chartData.length === 1 || chartData.filter((d) => d.value > 0).length === 1 ? (
            // Full circle if only one item has value
            <circle cx={centerX} cy={centerY} r={radius} fill={colors[chartData.findIndex((d) => d.value > 0) % colors.length]} className={cn("transition-all duration-1000", !animated && "opacity-0 scale-90 origin-center")} />
          ) : (
            chartData.map((item, i) => {
              if (item.value === 0) return null;
              const percentage = item.value / total;
              const angle = percentage * 360;

              const x1 = centerX + radius * Math.cos((currentAngle - 90) * (Math.PI / 180));
              const y1 = centerY + radius * Math.sin((currentAngle - 90) * (Math.PI / 180));
              const x2 = centerX + radius * Math.cos((currentAngle + angle - 90) * (Math.PI / 180));
              const y2 = centerY + radius * Math.sin((currentAngle + angle - 90) * (Math.PI / 180));

              const largeArcFlag = angle > 180 ? 1 : 0;
              const d = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

              const color = colors[i % colors.length];
              const sliceAngle = currentAngle;
              currentAngle += angle;

              return (
                <path
                  key={i}
                  d={d}
                  fill={color}
                  className={cn("hover:opacity-80 transition-all duration-500 cursor-pointer origin-center", !animated && "opacity-0 scale-90")}
                  style={{
                    transitionDelay: `${i * 100}ms`,
                    transform: animated ? "scale(1)" : "scale(0.9)",
                  }}
                >
                  <title>
                    {item.label}: {item.value}
                  </title>
                </path>
              );
            })
          )}
          {/* Donut hole */}
          <circle cx={centerX} cy={centerY} r={radius * 0.6} className="fill-bg-card" />
          <circle cx={centerX} cy={centerY} r={radius * 0.6} className="fill-bg-surface" />
        </svg>
        <div className="flex flex-col gap-2 overflow-y-auto max-h-40 min-w-[120px]">
          {chartData.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2 text-text-muted truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="font-mono font-bold text-text-primary">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("growth-chart flex flex-col h-full", className)}>
      {type === "column" && renderColumn()}
      {type === "line" && renderLine()}
      {type === "pie" && renderPie()}
    </div>
  );
}
