'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ChartData {
  label: string;
  value: number; // 0-100 for percentage height
}

interface WeeklyChartProps {
  data: ChartData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="weekly-chart flex flex-col h-full">
      <div className="chart-bars flex items-end justify-between gap-2 h-48 px-2">
        {data.map((item, i) => (
          <div key={i} className="chart-bar-col flex flex-col items-center flex-1 gap-2">
            <div className="chart-bar-container relative w-full h-full bg-bg-surface rounded-t-lg overflow-hidden group">
              <div
                className={cn(
                  'chart-bar-fill absolute bottom-0 left-0 right-0 bg-primary/80 group-hover:bg-primary transition-all duration-1000 ease-out rounded-t-md',
                  !animated && 'h-0'
                )}
                style={{ height: animated ? `${item.value}%` : '0%' }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-[10px] font-mono bg-bg-elevated px-1 rounded border border-border shadow-sm">
                  {item.value}%
                </span>
              </div>
            </div>
            <div className="chart-bar-label text-[11px] font-medium text-text-muted">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-6 text-[11px] text-text-muted px-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span>API Requests</span>
        </div>
        <div className="ml-auto">
          <span>Peak: {data.reduce((prev, current) => (prev.value > current.value) ? prev : current).label}</span>
        </div>
      </div>
    </div>
  );
}
