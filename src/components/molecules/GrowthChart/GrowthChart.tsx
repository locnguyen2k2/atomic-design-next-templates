'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';

export type ChartType = 'pie' | 'column' | 'line';

interface GrowthChartProps {
  data?: {
    labels: string[];
    values: number[];
  };
  type: ChartType;
  title?: string;
  className?: string;
}

export function GrowthChart({ data, type, title, className }: GrowthChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [data, type]);

  const chartData = useMemo(() => {
    if (!data || !data.labels || !data.values) return [];
    return data.labels.map((label, i) => ({
      label: new Date(label).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      value: data.values[i],
      originalLabel: label
    }));
  }, [data]);

  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map(d => d.value), 1);
  }, [chartData]);

  if (!data || chartData.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-48 text-text-muted text-sm", className)}>
        No data available
      </div>
    );
  }

  const renderColumn = () => (
    <div className="flex items-end justify-between gap-2 h-48 px-2">
      {chartData.map((item, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
          <div className="relative w-full h-full bg-bg-surface rounded-t-lg overflow-hidden">
            <div
              className={cn(
                'absolute bottom-0 left-0 right-0 bg-primary/80 group-hover:bg-primary transition-all duration-1000 ease-out rounded-t-md',
                !animated && 'h-0'
              )}
              style={{ height: animated ? `${(item.value / maxValue) * 100}%` : '0%' }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="text-[10px] font-mono bg-bg-elevated px-1 rounded border border-border shadow-sm">
                {item.value}
              </span>
            </div>
          </div>
          <div className="text-[10px] font-medium text-text-muted truncate w-full text-center">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );

  const renderLine = () => {
    const width = 400;
    const height = 192;
    const padding = 20;
    const points = chartData.map((item, i) => {
      const x = (i / (chartData.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((item.value / maxValue) * (height - padding * 2) + padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative h-48">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("text-primary transition-all duration-1000 ease-out", !animated && "opacity-0")}
            points={points}
            strokeDasharray={animated ? "0" : "1000"}
          />
          {chartData.map((item, i) => {
            const x = (i / (chartData.length - 1)) * (width - padding * 2) + padding;
            const y = height - ((item.value / maxValue) * (height - padding * 2) + padding);
            return (
              <g key={i} className="group">
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  className={cn("fill-primary stroke-bg-surface stroke-2 transition-all duration-500", !animated && "opacity-0")}
                />
                <foreignObject x={x - 20} y={y - 25} width="40" height="20" className="opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="text-[10px] text-center bg-bg-elevated rounded border border-border">{item.value}</div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
        <div className="flex justify-between mt-2 px-2">
           {chartData.filter((_, i) => i % Math.ceil(chartData.length / 5) === 0).map((item, i) => (
             <div key={i} className="text-[10px] text-text-muted">{item.label}</div>
           ))}
        </div>
      </div>
    );
  };

  const renderPie = () => {
    const total = chartData.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = 0;
    const radius = 70;
    const centerX = 100;
    const centerY = 100;

    return (
      <div className="flex items-center justify-center h-48 gap-8">
        <svg viewBox="0 0 200 200" className="w-40 h-40">
          {chartData.map((item, i) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const x1 = centerX + radius * Math.cos((currentAngle - 90) * (Math.PI / 180));
            const y1 = centerY + radius * Math.sin((currentAngle - 90) * (Math.PI / 180));
            const x2 = centerX + radius * Math.cos((currentAngle + angle - 90) * (Math.PI / 180));
            const y2 = centerY + radius * Math.sin((currentAngle + angle - 90) * (Math.PI / 180));
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            const d = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-warning', 'bg-violet', 'bg-danger'];
            const color = colors[i % colors.length].replace('bg-', '');
            
            currentAngle += angle;
            
            return (
              <path
                key={i}
                d={d}
                fill={`currentColor`}
                className={cn(`text-${color}/80 hover:text-${color} transition-all duration-300`, !animated && "opacity-0")}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <title>{item.label}: {item.value}</title>
              </path>
            );
          })}
          <circle cx={centerX} cy={centerY} r={radius * 0.5} className="fill-bg-card" />
        </svg>
        <div className="flex flex-col gap-1 overflow-y-auto max-h-40">
           {chartData.slice(0, 5).map((item, i) => {
             const colors = ['bg-primary', 'bg-accent', 'bg-success', 'bg-warning', 'bg-violet', 'bg-danger'];
             return (
               <div key={i} className="flex items-center gap-2 text-[10px] text-text-muted">
                 <span className={cn("w-2 h-2 rounded-full", colors[i % colors.length])} />
                 <span className="truncate max-w-[80px]">{item.label}</span>
                 <span className="font-mono">{item.value}</span>
               </div>
             );
           })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("growth-chart flex flex-col h-full", className)}>
      {type === 'column' && renderColumn()}
      {type === 'line' && renderLine()}
      {type === 'pie' && renderPie()}
    </div>
  );
}
