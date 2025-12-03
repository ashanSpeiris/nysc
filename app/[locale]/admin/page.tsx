'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Calendar, MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function AdminDashboard() {
  // TODO: Replace with actual data from database
  const stats = {
    totalVolunteers: 1247,
    newToday: 23,
    activeDistricts: 18,
    upcomingEvents: 5,
    weeklyGrowth: 15.3,
  };

  const recentVolunteers = [
    {
      id: 1,
      name: 'Nimal Silva',
      district: 'Colombo',
      type: 'Medical services',
      date: '2025-12-03',
    },
    {
      id: 2,
      name: 'Priya Kumar',
      district: 'Kandy',
      type: 'Cleaning labor',
      date: '2025-12-03',
    },
    {
      id: 3,
      name: 'Saman Perera',
      district: 'Galle',
      type: 'Transportation',
      date: '2025-12-02',
    },
  ];

  const districtStats = [
    { district: 'Colombo', count: 234 },
    { district: 'Kandy', count: 189 },
    { district: 'Galle', count: 156 },
    { district: 'Jaffna', count: 142 },
    { district: 'Batticaloa', count: 128 },
  ];

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
              +{stats.newToday} today
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
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Weekly Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.weeklyGrowth}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Compared to last week
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
              {recentVolunteers.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{volunteer.name}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {volunteer.district}
                      </span>
                      <span>•</span>
                      <span>{volunteer.type}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {volunteer.date}
                  </div>
                </div>
              ))}
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
              {districtStats.map((item, index) => (
                <div key={item.district} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{item.district}</p>
                      <p className="text-sm font-semibold">{item.count}</p>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${(item.count / stats.totalVolunteers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
