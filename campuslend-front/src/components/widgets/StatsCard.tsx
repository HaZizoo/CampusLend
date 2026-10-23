import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'positive',
}) => {
  const trendClass =
    trendType === 'positive'
      ? 'text-success'
      : trendType === 'negative'
        ? 'text-error'
        : 'text-muted';

  return (
    <div className="glass rounded-2xl p-5 shadow-glass transition-all duration-300 hover:shadow-glass-hover hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 rounded-xl p-2.5 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-medium text-muted">{title}</h3>
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trendClass}`}>{trend}</span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
};

export default StatsCard;
