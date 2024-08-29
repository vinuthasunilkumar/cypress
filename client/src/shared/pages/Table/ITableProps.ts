import { SortingRule } from "react-table";

export interface ITableProps {
  id?: string;
  columns: any[];
  defaultSortColumn?: string;
  defaultSortDirection?: 'asc' | 'desc';
  data: any[];
  hiddenColumn?: string;
  noDataMessage?: string;
  sortableColumns?: any[];
  tableClassName?: string;
  onSort: (sortBy: SortingRule<object>[]) => void;
  manualSortBy: boolean;
}
