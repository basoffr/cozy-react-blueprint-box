
import { Filter, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLeadsFilters } from "@/hooks/useLeadsFilters";
import { useVisibleColumns } from "@/hooks/useVisibleColumns";

interface FiltersDrawerProps {
  onFiltersChange: (filters: any[]) => void;
}

export function FiltersDrawer({ onFiltersChange }: FiltersDrawerProps) {
  const { 
    filters, 
    addFilter, 
    updateFilter, 
    removeFilter, 
    clearFilters,
    getOperatorsForField,
    activeFiltersCount 
  } = useLeadsFilters();
  
  const { availableColumns } = useVisibleColumns();

  const handleApplyFilters = () => {
    const validFilters = filters.filter(f => f.value.trim());
    onFiltersChange(validFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
    onFiltersChange([]);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96">
        <SheetHeader>
          <SheetTitle>Filter Leads</SheetTitle>
          <SheetDescription>
            Add filters to narrow down your leads list
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4 mt-6">
          {filters.map((filter) => {
            const fieldConfig = availableColumns.find(col => col.key === filter.field);
            const operators = getOperatorsForField(fieldConfig?.type || 'string');
            
            return (
              <div key={filter.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                <Select
                  value={filter.field}
                  onValueChange={(value) => updateFilter(filter.id, { field: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColumns.map((column) => (
                      <SelectItem key={column.key} value={column.key}>
                        {column.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filter.operator}
                  onValueChange={(value) => updateFilter(filter.id, { operator: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Value"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                  className="flex-1"
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter(filter.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addFilter}
              disabled={filters.length >= 5}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
          </div>

          <div className="flex space-x-2 pt-4 border-t">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
