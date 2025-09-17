import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  onClick: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  color,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-l-4 ${color}`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
          <div className={`${color.replace('border-', 'text-').replace('-500', '-600')}`}>
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};