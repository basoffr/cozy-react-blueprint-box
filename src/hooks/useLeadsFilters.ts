
import { useState } from 'react';

export interface FilterRow {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface FilterOperator {
  value: string;
  label: string;
  types: string[];
}

const FILTER_OPERATORS: FilterOperator[] = [
  { value: 'contains', label: 'Contains', types: ['string', 'email'] },
  { value: 'equals', label: 'Equals', types: ['string', 'email'] },
  { value: 'not_equals', label: 'Not equals', types: ['string', 'email'] },
  { value: 'greater_than', label: 'After', types: ['date'] },
  { value: 'less_than', label: 'Before', types: ['date'] },
];

export function useLeadsFilters() {
  const [filters, setFilters] = useState<FilterRow[]>([]);

  const addFilter = () => {
    if (filters.length < 5) {
      const newFilter: FilterRow = {
        id: Date.now().toString(),
        field: 'email',
        operator: 'contains',
        value: '',
      };
      setFilters([...filters, newFilter]);
    }
  };

  const updateFilter = (id: string, updates: Partial<FilterRow>) => {
    setFilters(filters.map(filter => 
      filter.id === id ? { ...filter, ...updates } : filter
    ));
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  const getOperatorsForField = (fieldType: string) => {
    return FILTER_OPERATORS.filter(op => op.types.includes(fieldType));
  };

  const activeFiltersCount = filters.filter(f => f.value.trim()).length;

  return {
    filters,
    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,
    getOperatorsForField,
    activeFiltersCount,
    availableOperators: FILTER_OPERATORS,
  };
}
