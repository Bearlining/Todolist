import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, subtitle, icon: Icon, color, trend }: StatCardProps) {
  return (
    <Card className="p-4 hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}30` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
      {trend && (
        <div className={cn(
          "mt-3 text-xs font-medium",
          trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-gray-400"
        )}>
          {trend === 'up' ? '↑ 上升' : trend === 'down' ? '↓ 下降' : '→ 持平'}
        </div>
      )}
    </Card>
  );
}
