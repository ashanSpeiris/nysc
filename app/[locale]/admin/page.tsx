'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface DashboardStats {
  totalVolunteers: number;
  activeDistricts: number;
  serviceTypes: number;
  growthRate: number;
}

interface RecentVolunteer {
  id: string;
  name: string;
  district: string;
  volunteerType: string;
  createdAt: string;
}

interface DistrictStat {
  district: string;
  count: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalVolunteers: 0,
    activeDistricts: 0,
    serviceTypes: 0,
    growthRate: 0,
  });
  const [recentVolunteers, setRecentVolunteers] = useState<RecentVolunteer[]>([]);
  const [districtStats, setDistrictStats] = useState<DistrictStat[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const statsResponse = await fetch('/api/admin/statistics');
        const statsData = await statsResponse.json();

        if (statsData.success) {
          setStats(statsData.data.overview);
          setDistrictStats(statsData.data.districtStats.slice(0, 5)); // Top 5 districts
        }

        // Fetch recent volunteers
        const volunteersResponse = await fetch('/api/admin/volunteers?page=1&limit=3');
        const volunteersData = await volunteersResponse.json();

        if (volunteersData.success) {
          setRecentVolunteers(volunteersData.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of volunteer registrations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Volunteers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All registered volunteers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Districts
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDistricts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of 25 districts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Service Types
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.serviceTypes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Different volunteer types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Growth Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.growthRate > 0 ? '+' : ''}{stats.growthRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Month over month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Volunteers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Volunteers</span>
              <Link
                href="/en/admin/volunteers"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                View All
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVolunteers.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No volunteers registered yet
                </p>
              ) : (
                recentVolunteers.map((volunteer) => (
                  <div
                    key={volunteer.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{volunteer.name}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {volunteer.district.replace('_', ' ')}
                        </span>
                        <span>•</span>
                        <span>{volunteer.volunteerType.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(volunteer.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Districts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Districts by Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {districtStats.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No district data available
                </p>
              ) : (
                districtStats.map((item, index) => {
                  const maxCount = Math.max(...districtStats.map((d) => d.count));
                  return (
                    <div key={item.district} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{item.district.replace('_', ' ')}</p>
                          <p className="text-sm font-semibold">{item.count}</p>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${(item.count / maxCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/en/admin/volunteers"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <Users className="h-4 w-4" />
              View All Volunteers
            </Link>
            <Link
              href="/en/admin/volunteers?export=true"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <TrendingUp className="h-4 w-4" />
              Export Data
            </Link>
            <Link
              href="/en"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <Calendar className="h-4 w-4" />
              View Registration Form
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
