import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

interface MetricsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function MetricsCard({
  title,
  value,
  unit,
  change,
  changeType = 'neutral',
  icon,
  className
}: MetricsCardProps) {
  return (
    <Card className={cn("bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#6B7280]">
          {title}
        </CardTitle>
        {icon && <div className="text-[#FF8C00]">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#1A1D23]">
          {value}
          {unit && <span className="text-sm text-[#6B7280] ml-1">{unit}</span>}
        </div>
        {change && (
          <p
            className={cn(
              "text-xs mt-1",
              changeType === 'positive' && "text-green-600",
              changeType === 'negative' && "text-red-600",
              changeType === 'neutral' && "text-blue-600",
              changeType === 'warning' && "text-yellow-600"
            )}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}