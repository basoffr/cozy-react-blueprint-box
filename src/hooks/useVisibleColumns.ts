
import { useState, useEffect } from 'react';

export interface ColumnConfig {
  key: string;
  label: string;
  type: 'string' | 'date' | 'email';
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'bedrijf', label: 'Bedrijf', type: 'string' },
  { key: 'website', label: 'Website', type: 'string' },
  { key: 'linkedin', label: 'LinkedIn', type: 'string' },
  { key: 'image_path', label: 'Avatar', type: 'string' },
  { key: 'created_at', label: 'Created', type: 'date' },
];

const STORAGE_KEY = 'leads.visibleColumns';

export function useVisibleColumns() {
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setVisibleColumns(JSON.parse(stored));
      } catch {
        setVisibleColumns(DEFAULT_COLUMNS.map(col => col.key));
      }
    } else {
      setVisibleColumns(DEFAULT_COLUMNS.map(col => col.key));
    }
  }, []);

  const updateVisibleColumns = (columns: string[]) => {
    setVisibleColumns(columns);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  };

  const toggleColumn = (columnKey: string) => {
    const newColumns = visibleColumns.includes(columnKey)
      ? visibleColumns.filter(key => key !== columnKey)
      : [...visibleColumns, columnKey];
    updateVisibleColumns(newColumns);
  };

  return {
    visibleColumns,
    availableColumns: DEFAULT_COLUMNS,
    updateVisibleColumns,
    toggleColumn,
  };
}
