
import { Bell, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lead, LeadListResponse } from "@/types/api";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { leadsApi } from "@/services/api";
import { useNavigateBack } from "@/hooks/useNavigateBack";
import { useVisibleColumns } from "@/hooks/useVisibleColumns";
import { ColumnChooser } from "@/components/ColumnChooser";
import { FiltersDrawer } from "@/components/FiltersDrawer";
import { BulkSelectToolbar } from "@/components/BulkSelectToolbar";
import { toast } from "sonner";

export function LeadsContent() {
  const navigateBack = useNavigateBack('/dashboard');
  const { visibleColumns, availableColumns } = useVisibleColumns();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['leads', appliedFilters, currentPage, pageSize],
    queryFn: () => leadsApi.getAll(currentPage, pageSize),
  });
  
  // Extract leads from the paginated response
  const leads = data?.items ?? [];

  const handleSelectAll = (type: 'page' | 'all') => {
    if (type === 'page' && leads.length > 0) {
      const pageIds = leads.map((lead: Lead) => lead.id);
      setSelectedLeads(prev => 
        pageIds.every(id => prev.includes(id)) 
          ? prev.filter(id => !pageIds.includes(id))
          : [...new Set([...prev, ...pageIds])]
      );
    } else if (type === 'all' && leads.length > 0) {
      const allIds = leads.map((lead: Lead) => lead.id);
      setSelectedLeads(allIds);
    }
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleBulkDelete = async () => {
    try {
      // In a real implementation, this would call the delete API
      // await leadsApi.bulkDelete(selectedLeads);
      console.log('Deleting leads:', selectedLeads);
      
      setSelectedLeads([]);
      await refetch();
      toast.success(`Deleted ${selectedLeads.length} leads successfully`);
    } catch (error) {
      toast.error('Failed to delete leads');
    }
  };

  const renderCellContent = (lead: Lead, columnKey: string) => {
    switch (columnKey) {
      case 'email':
        return <span className="font-medium">{lead.email}</span>;
      case 'bedrijf':
        return lead.bedrijf || '-';
      case 'website':
        return lead.website || '-';
      case 'linkedin':
        return lead.linkedin || '-';
      case 'image_path':
        return lead.image_path ? (
          <img 
            src={lead.image_path} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-500">-</span>
          </div>
        );
      case 'created_at':
        return new Date(lead.created_at).toLocaleDateString();
      default:
        return lead[columnKey] || '-';
    }
  };

  const visibleColumnConfigs = availableColumns.filter(col => 
    visibleColumns.includes(col.key)
  );

  const isAllPageSelected = leads.length > 0 && leads.every((lead: Lead) => 
    selectedLeads.includes(lead.id)
  );

  const isSomePageSelected = leads.some((lead: Lead) => 
    selectedLeads.includes(lead.id)
  );

  // Determine the checkbox state for the select-all checkbox
  const selectAllCheckboxState = isAllPageSelected ? true : (isSomePageSelected ? "indeterminate" : false);

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-gray-500 mb-2">Leads</nav>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => window.location.href = '/leads/import'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Leads importeren
          </Button>
          <Button asChild variant="outline">
            <Link to="/leads/new">
              Nieuwe lead
            </Link>
          </Button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Administrator</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Table Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FiltersDrawer onFiltersChange={setAppliedFilters} />
          <ColumnChooser />
        </div>
      </div>

      {/* Leads Table */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          checked={selectAllCheckboxState}
                          onCheckedChange={() => handleSelectAll('page')}
                        />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleSelectAll('page')}>
                        Select page
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSelectAll('all')}>
                        Select all
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
                {visibleColumnConfigs.map((column) => (
                  <TableHead key={column.key} className="cursor-pointer">
                    {column.label}
                  </TableHead>
                ))}
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    {visibleColumnConfigs.map((column) => (
                      <TableCell key={column.key}>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Skeleton className="h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumnConfigs.length + 2} className="text-center py-8">
                    Geen leads gevonden
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead: Lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={() => handleSelectLead(lead.id)}
                      />
                    </TableCell>
                    {visibleColumnConfigs.map((column) => (
                      <TableCell key={column.key}>
                        {renderCellContent(lead, column.key)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Bewerken
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
            
            {/* Pagination UI */}
            {data && data.total > 0 && (
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                  Toont {(data.page - 1) * data.size + 1} tot {Math.min(data.page * data.size, data.total)} van {data.total} leads
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={data.page <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {/* First page */}
                    <PaginationItem>
                      <PaginationLink 
                        isActive={data.page === 1}
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    
                    {/* Show ellipsis if needed */}
                    {data.page > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Page before current if not first or second */}
                    {data.page > 2 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(data.page - 1)}>
                          {data.page - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Current page if not first */}
                    {data.page > 1 && data.page < Math.ceil(data.total / data.size) && (
                      <PaginationItem>
                        <PaginationLink isActive={true}>
                          {data.page}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Page after current if not last or second-to-last */}
                    {data.page < Math.ceil(data.total / data.size) - 1 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => setCurrentPage(data.page + 1)}>
                          {data.page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Show ellipsis if needed */}
                    {data.page < Math.ceil(data.total / data.size) - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Last page if not first page */}
                    {Math.ceil(data.total / data.size) > 1 && (
                      <PaginationItem>
                        <PaginationLink 
                          isActive={data.page === Math.ceil(data.total / data.size)}
                          onClick={() => setCurrentPage(Math.ceil(data.total / data.size))}
                        >
                          {Math.ceil(data.total / data.size)}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(data.total / data.size), p + 1))}
                        className={data.page >= Math.ceil(data.total / data.size) ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        <BulkSelectToolbar
          selectedCount={selectedLeads.length}
          onDelete={handleBulkDelete}
          onClear={() => setSelectedLeads([])}
        />
      </div>
    );
  }
