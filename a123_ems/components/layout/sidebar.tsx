'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Zap,
  Map,
  FileText,
  Settings,
  LogOut,
  User,
  AlertTriangle,
  Code,
  Battery,
  Activity,
  Radio
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { energyDataSimulator } from '../map/utils/dataSimulator';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Battery Containers', href: '/assets', icon: Zap },
  { name: 'Product Catalog', href: '/products', icon: Battery },
  { name: 'Demand Response', href: '/demand-response', icon: Activity },
  { name: 'Ancillary Services', href: '/ancillary-services', icon: Radio },
  { name: 'Map', href: '/map', icon: Map },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle, hasNotification: true },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'API Docs', href: '/api-docs', icon: Code },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);

  useEffect(() => {
    // Subscribe to the data simulator to get real-time alert counts
    const unsubscribe = energyDataSimulator.subscribe((assets) => {
      // Count all active alerts from all assets
      const totalAlerts = assets.reduce((sum, asset) => sum + asset.alerts.length, 0);
      setActiveAlertsCount(totalAlerts);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-[#E5E7EB]">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-[#E5E7EB]">
        <h1 className="text-xl font-bold text-[#1A1D23]">A123 Battery EMS</h1>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                isActive
                  ? "bg-[#FF8C00] text-white shadow-sm"
                  : "text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-[#9CA3AF] group-hover:text-[#FF8C00]"
                )}
              />
              {item.name}
              {item.hasNotification && activeAlertsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600"
                >
                  {activeAlertsCount > 99 ? '99+' : activeAlertsCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E5E7EB] p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex-shrink-0">
            <User className="h-8 w-8 text-[#9CA3AF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1A1D23] truncate">
              {session?.user?.username || 'User'}
            </p>
            <p className="text-sm text-[#6B7280] truncate">
              {session?.user?.role || 'Operator'}
            </p>
          </div>
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: '/login' })}
          variant="outline"
          size="sm"
          className="w-full border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}