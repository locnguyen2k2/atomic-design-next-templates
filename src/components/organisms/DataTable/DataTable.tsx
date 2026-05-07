"use client";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Skeleton } from "@/components/atoms/Skeleton";
import { DateRangePicker } from "@/components/atoms/DateRangePicker";
import { SearchForm } from "@/components/molecules/SearchForm";
import { Pagination } from "@/components/molecules/Pagination";
import { cn } from "@/lib/utils";
import type { IconName } from "@/types/icon";

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  type?: "text" | "slug" | "date" | "org" | "desc";
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  isLoading?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onSort?: (field: string, order: "asc" | "desc") => void;
  onPageChange?: (page: number) => void;
  onCreate?: () => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters?: React.ReactNode;
  enableDateRangeFilter?: boolean;
  onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
  dateRangeFilterLabel?: string;
  dateRangeFilterValue?: { from?: Date; to?: Date };
  emptyState?: {
    icon: IconName;
    title: string;
    message: string;
  };
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyField,
  isLoading,
  searchPlaceholder,
  onSearch,
  onSort,
  onPageChange,
  onCreate,
  onView,
  onEdit,
  onDelete,
  pagination,
  filters,
  enableDateRangeFilter,
  onDateRangeChange,
  dateRangeFilterLabel,
  dateRangeFilterValue,
  emptyState,
}: DataTableProps<T>) {
  return (
    <div className="data-table-wrapper">
      {/* Toolbar */}
      <div className="table-toolbar flex items-center gap-4 p-4 border-b border-border">
        {onSearch && <SearchForm placeholder={searchPlaceholder || "Search..."} onSearch={onSearch} />}

        {enableDateRangeFilter && <DateRangePicker value={dateRangeFilterValue} onChange={onDateRangeChange} label={dateRangeFilterLabel || "Date Range"} className="min-w-[300px]" />}

        {filters}

        <div className="toolbar-spacer flex-1" />

        <span className="toolbar-results text-sm text-text-muted">{pagination?.totalItems ?? data.length} records</span>

        {onCreate && (
          <Button onClick={onCreate}>
            <Icon name="plus" /> Create
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th key={String(col.key)} className={cn("px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider", col.sortable && "cursor-pointer hover:text-text-primary")} onClick={() => col.sortable && onSort?.(String(col.key), "asc")}>
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-b border-border-subtle">
                  {columns.map((col, j) => (
                    <td key={`skeleton-cell-${i}-${j}`} className="px-4 py-4">
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </td>
                  ))}
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-0">
                  {emptyState && (
                    <div className="empty-state">
                      <Icon name={emptyState.icon} className="empty-state-icon" />
                      <div className="empty-state-title">{emptyState.title}</div>
                      <div className="empty-state-message">{emptyState.message}</div>
                      {onCreate && (
                        <Button onClick={onCreate}>
                          <Icon name="plus" /> Create New
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={String(row[keyField])}
                  className="border-b border-border-subtle hover:bg-bg-surface transition-colors"
                  onClick={(e: any) => {
                    onView ? onView(row) : undefined;
                    e.preventDefault();
                  }}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      {col.render ? col.render(row) : <span className="text-sm">{String(row[col.key as keyof T] ?? "—")}</span>}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="table-cell-actions flex justify-end gap-1">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                          }}
                        >
                          <Icon name="eye" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                        >
                          <Icon name="pen" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                        >
                          <Icon name="trash" className="text-danger" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} totalItems={pagination.totalItems} itemsPerPage={pagination.itemsPerPage} onPageChange={onPageChange!} />}
    </div>
  );
}
