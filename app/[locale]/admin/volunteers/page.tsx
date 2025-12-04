'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Download,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DISTRICTS, VOLUNTEER_TYPES } from '@/lib/constants';

interface Volunteer {
  id: string;
  displayId: number;
  name: string;
  email: string;
  whatsapp: string;
  ageRange: string;
  sex: string;
  district: string;
  volunteerType: string;
  startDate: string;
  duration: string;
  availableDistricts: string[];
  createdAt: string;
  status: string;
}

export default function VolunteersListPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch volunteers from API
  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        district: districtFilter,
        volunteerType: typeFilter,
      });

      const response = await fetch(`/api/admin/volunteers?${params}`);
      const data = await response.json();

      console.log('📥 API Response:', {
        success: data.success,
        count: data.data?.length,
        total: data.pagination?.total,
        volunteers: data.data?.map((v: Volunteer) => ({ id: v.id, name: v.name }))
      });

      if (data.success) {
        setVolunteers(data.data);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch volunteers when filters change
  useEffect(() => {
    fetchVolunteers();
  }, [currentPage, searchTerm, districtFilter, typeFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, districtFilter, typeFilter]);

  const totalPages = Math.ceil(total / itemsPerPage);

  // Export to CSV
  const exportToCSV = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        district: districtFilter,
        volunteerType: typeFilter,
      });

      const response = await fetch(`/api/admin/volunteers/export?${params}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NYSC-Volunteers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error exporting volunteers:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDistrictFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== '' || districtFilter !== 'all' || typeFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Volunteers</h1>
          <p className="text-muted-foreground">
            Manage and view all volunteer registrations
          </p>
        </div>
        <Button onClick={exportToCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* District Filter */}
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {DISTRICTS.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {VOLUNTEER_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">
                Showing {total} volunteer{total !== 1 ? 's' : ''}
              </p>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : volunteers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No volunteers found
                    </TableCell>
                  </TableRow>
                ) : (
                  volunteers.map((volunteer) => (
                    <TableRow key={volunteer.id}>
                      <TableCell className="font-medium">
                        #{volunteer.displayId.toString().padStart(7, '0')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{volunteer.name}</p>
                          <Badge variant="outline" className="mt-1">
                            {volunteer.sex}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-muted-foreground">{volunteer.email}</p>
                          <p className="font-mono">{volunteer.whatsapp}</p>
                        </div>
                      </TableCell>
                      <TableCell>{volunteer.ageRange}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {volunteer.district.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        <span className="text-sm">
                          {volunteer.volunteerType.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(volunteer.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={volunteer.duration === 'full' ? 'default' : 'outline'}>
                          {volunteer.duration === 'full' ? 'Full (5d)' : `${volunteer.duration} day${volunteer.duration === '1' ? '' : 's'}`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(volunteer.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t p-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
