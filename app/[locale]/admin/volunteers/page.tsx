'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
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

// Mock data - TODO: Replace with database query
const mockVolunteers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Volunteer ${i + 1}`,
  email: `volunteer${i + 1}@example.com`,
  whatsapp: `+94 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
  ageRange: ['18-20', '20-30', '30-40'][Math.floor(Math.random() * 3)],
  sex: ['male', 'female', 'other'][Math.floor(Math.random() * 3)],
  district: DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)],
  volunteerType: VOLUNTEER_TYPES[Math.floor(Math.random() * VOLUNTEER_TYPES.length)],
  startDate: new Date(2025, 11, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  duration: ['1', '2', '3', '4', 'full'][Math.floor(Math.random() * 5)],
  availableDistricts: DISTRICTS.slice(0, Math.floor(Math.random() * 5) + 1),
  createdAt: new Date(2025, 11, Math.floor(Math.random() * 3) + 1).toISOString(),
}));

export default function VolunteersListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter volunteers
  const filteredVolunteers = mockVolunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.whatsapp.includes(searchTerm);

    const matchesDistrict =
      districtFilter === 'all' || volunteer.district === districtFilter;

    const matchesType =
      typeFilter === 'all' || volunteer.volunteerType === typeFilter;

    return matchesSearch && matchesDistrict && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVolunteers = filteredVolunteers.slice(startIndex, endIndex);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Email',
      'WhatsApp',
      'Age Range',
      'Sex',
      'District',
      'Volunteer Type',
      'Start Date',
      'Duration',
      'Available Districts',
      'Registered On',
    ];

    const csvData = filteredVolunteers.map((v) => [
      v.id,
      v.name,
      v.email || 'N/A',
      v.whatsapp,
      v.ageRange,
      v.sex,
      v.district.replace('_', ' '),
      v.volunteerType.replace(/([A-Z])/g, ' $1').trim(),
      v.startDate,
      v.duration === 'full' ? 'Full session (5 days)' : `${v.duration} day${v.duration === '1' ? '' : 's'}`,
      v.availableDistricts.map(d => d.replace('_', ' ')).join('; '),
      new Date(v.createdAt).toLocaleDateString(),
    ]);

    // Create CSV content with UTF-8 BOM for Excel compatibility
    const csvContent = [
      headers.join(','),
      ...csvData.map((row) =>
        row.map((cell) => {
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          const cellStr = String(cell).replace(/"/g, '""');
          return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')
            ? `"${cellStr}"`
            : cellStr;
        }).join(',')
      ),
    ].join('\r\n');

    // Add UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NYSC-Volunteers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    // Clean up
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
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
                Showing {filteredVolunteers.length} of {mockVolunteers.length} volunteers
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
                {currentVolunteers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No volunteers found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentVolunteers.map((volunteer) => (
                    <TableRow key={volunteer.id}>
                      <TableCell className="font-medium">#{volunteer.id}</TableCell>
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
                      <TableCell>{volunteer.startDate}</TableCell>
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
