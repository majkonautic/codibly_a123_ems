'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { energyDataSimulator } from '../../components/map/utils/dataSimulator';
import type { SimulatedAsset } from '../../components/map/utils/dataSimulator';
import type { DRProgram, DREvent } from '../../lib/drTypes';
import {
  Zap,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  MapPin,
  Award,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function DemandResponsePage() {
  const [assets, setAssets] = useState<SimulatedAsset[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('all');

  useEffect(() => {
    const unsubscribe = energyDataSimulator.subscribe((updatedAssets) => {
      setAssets(updatedAssets);
    });

    return unsubscribe;
  }, []);

  // Aggregate all DR programs across all assets
  const allPrograms: DRProgram[] = [];
  const programMap = new Map<string, { program: DRProgram; assets: SimulatedAsset[] }>();

  assets.forEach(asset => {
    asset.demandResponse.enrolledPrograms.forEach(program => {
      if (!programMap.has(program.id)) {
        programMap.set(program.id, { program, assets: [asset] });
        allPrograms.push(program);
      } else {
        const entry = programMap.get(program.id)!;
        entry.assets.push(asset);
      }
    });
  });

  // Aggregate all DR events
  const allActiveEvents: Array<DREvent & { assetId: string; assetName: string }> = [];
  const allUpcomingEvents: Array<DREvent & { assetId: string; assetName: string }> = [];

  assets.forEach(asset => {
    asset.demandResponse.activeEvents.forEach(event => {
      allActiveEvents.push({ ...event, assetId: asset.id, assetName: asset.name });
    });
    asset.demandResponse.upcomingEvents.forEach(event => {
      allUpcomingEvents.push({ ...event, assetId: asset.id, assetName: asset.name });
    });
  });

  // Calculate portfolio-level metrics
  const totalDRCapacity = assets.reduce((sum, asset) =>
    sum + asset.demandResponse.drCapacity, 0
  );

  const totalAvailableAssets = assets.filter(asset =>
    asset.demandResponse.availableForDR
  ).length;

  const totalRevenue = allPrograms.reduce((sum, program) =>
    sum + program.revenueToDate, 0
  );

  const totalPenalties = allPrograms.reduce((sum, program) =>
    sum + program.penaltiesIncurred, 0
  );

  // Filter programs if needed
  const displayPrograms = selectedProgram === 'all'
    ? allPrograms
    : allPrograms.filter(p => p.id === selectedProgram);

  // Get ISO distribution
  const isoDistribution = new Map<string, number>();
  allPrograms.forEach(program => {
    isoDistribution.set(program.iso, (isoDistribution.get(program.iso) || 0) + 1);
  });

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-[#1A1D23] flex items-center">
                  <Activity className="h-8 w-8 mr-3 text-[#FF8C00]" />
                  Demand Response Programs
                </h1>
                <p className="text-[#6B7280] mt-2">
                  Monitor and manage grid service participation across all battery assets
                </p>
              </div>
            </div>

            {/* Portfolio Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white border-[#E5E7EB] shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-xs uppercase tracking-wide">Total DR Capacity</p>
                      <p className="text-2xl font-bold text-[#1A1D23]">
                        {totalDRCapacity.toFixed(1)} MW
                      </p>
                      <p className="text-xs text-[#9CA3AF]">{totalAvailableAssets}/{assets.length} assets available</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Zap className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-xs uppercase tracking-wide">Active Programs</p>
                      <p className="text-2xl font-bold text-green-600">{allPrograms.length}</p>
                      <p className="text-xs text-[#9CA3AF]">Across {isoDistribution.size} ISOs</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-xs uppercase tracking-wide">Total Revenue</p>
                      <p className="text-2xl font-bold text-[#FF8C00]">
                        ${(totalRevenue / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Net: ${((totalRevenue - totalPenalties) / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-[#FF8C00]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#6B7280] text-xs uppercase tracking-wide">Active Events</p>
                      <p className="text-2xl font-bold text-red-600">{allActiveEvents.length}</p>
                      <p className="text-xs text-[#9CA3AF]">{allUpcomingEvents.length} upcoming</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Activity className="h-5 w-5 text-red-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Active Events */}
          {allActiveEvents.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#1A1D23] mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-red-500" />
                Active DR Events
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {allActiveEvents.map((event) => (
                  <Card key={event.id} className="bg-red-50 border-red-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-[#1A1D23] text-base">{event.programName}</CardTitle>
                          <p className="text-sm text-[#6B7280] flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.assetName}
                          </p>
                        </div>
                        <Badge className="bg-red-500 text-white">
                          <Activity className="h-3 w-3 mr-1" />
                          Live
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-[#6B7280]">Capacity</p>
                          <p className="text-sm font-semibold text-[#1A1D23]">
                            {event.committedCapacity.toFixed(1)} MW
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280]">Performance</p>
                          <p className="text-sm font-semibold text-green-600">
                            {event.actualPerformance.toFixed(1)} MW
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280]">Duration</p>
                          <p className="text-sm font-semibold text-[#1A1D23]">
                            {event.duration} min
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280]">Compensation</p>
                          <p className="text-sm font-semibold text-[#FF8C00]">
                            ${(event.totalCompensation / 1000).toFixed(1)}K
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          {allUpcomingEvents.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#1A1D23] mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Upcoming DR Events
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {allUpcomingEvents.map((event) => (
                  <Card key={event.id} className="bg-white border-[#E5E7EB]">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-[#1A1D23] text-sm">{event.programName}</CardTitle>
                          <p className="text-xs text-[#6B7280] mt-1">{event.assetName}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-[#6B7280]">
                          <Clock className="h-3 w-3 mr-2" />
                          {new Date(event.startTime).toLocaleString()}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[#6B7280]">Requested</span>
                          <span className="text-sm font-semibold text-[#1A1D23]">
                            {event.requestedCapacity.toFixed(1)} MW
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[#6B7280]">Duration</span>
                          <span className="text-sm font-semibold text-[#1A1D23]">
                            {event.duration} min
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Enrolled Programs */}
          <div>
            <h2 className="text-xl font-bold text-[#1A1D23] mb-4">Enrolled Programs</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from(programMap.entries()).map(([programId, { program, assets: programAssets }]) => {
                const totalCapacity = programAssets.reduce((sum, asset) =>
                  sum + asset.demandResponse.drCapacity, 0
                );

                return (
                  <Card key={programId} className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="text-[#1A1D23] text-base">{program.name}</CardTitle>
                          <p className="text-sm text-[#6B7280]">{program.serviceType}</p>
                        </div>
                        <Badge className={`${
                          program.status === 'active' ? 'bg-green-500' :
                          program.status === 'paused' ? 'bg-yellow-500' :
                          program.status === 'pending' ? 'bg-blue-500' :
                          'bg-gray-500'
                        } text-white`}>
                          {program.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {program.iso}
                        </Badge>
                        <span className="text-xs text-[#9CA3AF]">
                          {programAssets.length} asset{programAssets.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 bg-[#F8F9FA] rounded-lg">
                          <div className="flex items-center mb-1">
                            <Zap className="h-3 w-3 mr-1 text-[#FF8C00]" />
                            <span className="text-xs text-[#6B7280]">Capacity</span>
                          </div>
                          <p className="text-sm font-semibold text-[#1A1D23]">
                            {totalCapacity.toFixed(1)} MW
                          </p>
                        </div>
                        <div className="p-3 bg-[#F8F9FA] rounded-lg">
                          <div className="flex items-center mb-1">
                            <Clock className="h-3 w-3 mr-1 text-[#FF8C00]" />
                            <span className="text-xs text-[#6B7280]">Response</span>
                          </div>
                          <p className="text-sm font-semibold text-[#1A1D23]">
                            {program.responseTimeRequired}s
                          </p>
                        </div>
                      </div>

                      {/* Financial Performance */}
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-green-900">Revenue</span>
                          <Award className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-green-700">Earned</span>
                            <span className="text-sm font-semibold text-green-900">
                              ${(program.revenueToDate / 1000).toFixed(1)}K
                            </span>
                          </div>
                          {program.penaltiesIncurred > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-red-600">Penalties</span>
                              <span className="text-sm font-semibold text-red-700">
                                -${(program.penaltiesIncurred / 1000).toFixed(1)}K
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-1 border-t border-green-300">
                            <span className="text-xs font-semibold text-green-900">Net</span>
                            <span className="text-sm font-bold text-green-900">
                              ${(program.netRevenue / 1000).toFixed(1)}K
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Compensation Details */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[#6B7280]">Rate</span>
                          <span className="font-semibold text-[#1A1D23]">
                            ${program.compensationRate}/{program.compensationType === 'capacity' ? 'MW' : 'MWh'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#6B7280]">Min Capacity</span>
                          <span className="font-semibold text-[#1A1D23]">
                            {program.minimumCapacity} MW
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#6B7280]">Expires</span>
                          <span className="font-semibold text-[#1A1D23]">
                            {new Date(program.expirationDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Assets in Program */}
                      <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                        <p className="text-xs font-semibold text-[#1A1D23] mb-2">Participating Assets</p>
                        <div className="flex flex-wrap gap-1">
                          {programAssets.slice(0, 3).map((asset) => (
                            <Badge key={asset.id} variant="outline" className="text-xs">
                              {asset.name.split(' ')[0]}
                            </Badge>
                          ))}
                          {programAssets.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{programAssets.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}