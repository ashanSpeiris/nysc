'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  PieChart,
} from 'lucide-react';

interface Statistics {
  overview: {
    totalVolunteers: number;
    activeDistricts: number;
    serviceTypes: number;
    growthRate: number;
  };
  volunteerTypeStats: { type: string; count: number }[];
  districtStats: { district: string; count: number }[];
  ageStats: { range: string; count: number }[];
  sexStats: { sex: string; count: number }[];
  durationStats: { duration: string; count: number }[];
  monthlyStats: { month: string; count: number }[];
  statusStats?: { status: string; count: number }[];
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/admin/statistics');
        const data = await response.json();

        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Failed to load statistics</p>
      </div>
    );
  }

  const {
    overview,
    volunteerTypeStats,
    districtStats,
    ageStats,
    sexStats,
    durationStats,
    monthlyStats,
  } = stats;

  const maxCount = Math.max(...volunteerTypeStats.map((s) => s.count));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Statistics</h1>
        <p className="text-muted-foreground">
          Detailed analytics and insights about volunteer registrations
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Volunteers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview.totalVolunteers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Active Districts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview.activeDistricts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Service Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview.serviceTypes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${overview.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overview.growthRate > 0 ? '+' : ''}{overview.growthRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Volunteer Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Volunteers by Service Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {volunteerTypeStats.map((stat) => (
                <div key={stat.type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">
                      {stat.type.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-semibold">{stat.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(stat.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* District Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top 10 Districts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {districtStats.map((stat, index) => (
                <div key={stat.district} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">
                        {stat.district.replace('_', ' ')}
                      </span>
                      <span className="font-semibold">{stat.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-secondary transition-all"
                        style={{
                          width: `${(stat.count / Math.max(...districtStats.map((s) => s.count))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ageStats.map((stat) => (
                <div key={stat.range} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-20 justify-center">
                      {stat.range}
                    </Badge>
                    <div className="h-3 w-48 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{
                          width: `${(stat.count / overview.totalVolunteers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{stat.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Gender Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sexStats.map((stat) => (
                <div key={stat.sex} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="w-20 justify-center">
                      {stat.sex}
                    </Badge>
                    <div className="h-3 w-48 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${(stat.count / overview.totalVolunteers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{stat.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Registration Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyStats.map((stat) => (
                <div key={stat.month} className="flex items-center gap-4">
                  <span className="w-12 text-sm font-medium">{stat.month}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-8 overflow-hidden rounded bg-muted" style={{ width: `${(stat.count / Math.max(...monthlyStats.map((s) => s.count))) * 100}%` }}>
                        <div className="h-full bg-gradient-to-r from-primary to-secondary" />
                      </div>
                      <span className="ml-4 text-sm font-semibold">{stat.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Duration Preference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Duration Preference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {durationStats.map((stat) => (
                <div key={stat.duration} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stat.duration}</span>
                    <span className="text-sm font-semibold">
                      {stat.count} ({((stat.count / overview.totalVolunteers) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-primary transition-all"
                      style={{ width: `${(stat.count / overview.totalVolunteers) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
