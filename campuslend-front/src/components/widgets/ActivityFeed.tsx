import React from 'react';
import { ShoppingBag, CheckCircle, Mail, Star, type LucideIcon } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'borrow' | 'return' | 'request' | 'review';
  title: string;
  time: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

interface ActivityFeedProps {
  title: string;
  activities: ActivityItem[];
}

const iconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  CheckCircle,
  Mail,
  Star,
};

const colorMap: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-gray-100 text-muted',
  success: 'bg-emerald-50 text-success',
  warning: 'bg-amber-50 text-warning',
  error: 'bg-red-50 text-error',
};

const typeLabels: Record<string, string> = {
  borrow: 'Borrowed this item',
  return: 'Returned this item',
  request: 'Sent a borrowing request',
  review: 'Left a review',
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ title, activities }) => {
  return (
    <div className="glass rounded-2xl p-6 shadow-glass transition-all duration-300 hover:shadow-glass-hover">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {activities.length === 0 ? (
        <div className="text-center py-6 text-muted">
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = iconMap[activity.icon] ?? ShoppingBag;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div
                    className={`rounded-xl p-2.5 ${colorMap[activity.color] ?? 'bg-gray-100 text-muted'}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{activity.title}</h4>
                    <span className="text-xs text-muted ml-2 whitespace-nowrap">{activity.time}</span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {typeLabels[activity.type]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
