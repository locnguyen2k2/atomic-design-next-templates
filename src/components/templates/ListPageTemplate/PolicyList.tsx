import React from "react";
import { AbacPolicy } from "@/types/abac";
import { PolicyCard } from "../../organisms/Policy/PolicyCard";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { cn } from "@/lib/utils";

interface PolicyListProps {
  policies: AbacPolicy[];
  isLoading?: boolean;
  filter: string;
  onFilterChange: (filter: any) => void;
  search: string;
  onSearchChange: (search: string) => void;
  dateRange?: { from?: Date; to?: Date };
  onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange?: (page: number) => void;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  onDelete: (id: string) => void;
  onEdit: (policy: AbacPolicy) => void;
  onDuplicate: (policy: AbacPolicy) => void;
  onCreate?: () => void;
}

export const PolicyList: React.FC<PolicyListProps> = ({ 
  policies, 
  isLoading,
  filter, 
  onFilterChange, 
  search, 
  onSearchChange, 
  dateRange,
  onDateRangeChange,
  pagination,
  onPageChange,
  onSort,
  onDelete, 
  onEdit, 
  onDuplicate,
  onCreate
}) => {
  const filterOptions = [
    { val: "all", label: "All" },
    { val: "ALLOW", label: "Allow" },
    { val: "DENY", label: "Deny" },
  ];

  const columns = [
    {
      key: 'card',
      label: 'Policy Details',
      render: (policy: AbacPolicy) => (
        <PolicyCard 
          key={policy.id} 
          policy={policy} 
          onDelete={onDelete} 
          onEdit={() => onEdit(policy)} 
          onDuplicate={() => onDuplicate(policy)} 
        />
      )
    }
  ];

  return (
    <div className="policy-list-container">
      <DataTable
        data={policies as any[]}
        columns={columns}
        keyField="id"
        isLoading={isLoading}
        searchPlaceholder="Search policies by name, description or ID..."
        onSearch={onSearchChange}
        enableDateRangeFilter={true}
        dateRangeFilterValue={dateRange}
        onDateRangeChange={onDateRangeChange}
        onSort={onSort}
        onPageChange={onPageChange}
        pagination={pagination}
        onCreate={onCreate}
        filters={
          <div className="abac-filter-group flex items-center gap-1">
            {filterOptions.map((opt) => (
              <button
                key={opt.val}
                onClick={() => onFilterChange(opt.val)}
                className={cn(
                  "abac-filter-btn px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                  filter === opt.val 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "text-text-secondary border-border hover:text-text-primary hover:border-primary hover:bg-primary/5"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        }
        emptyState={{
          icon: 'scroll',
          title: 'No policies found',
          message: 'Try adjusting your filters or search query.'
        }}
      />
      
      <style jsx global>{`
        .data-table {
          border-collapse: separate;
          border-spacing: 0 1rem;
          background: transparent !important;
        }
        .data-table thead {
          display: none;
        }
        .data-table tr {
          background: transparent !important;
          border: none !important;
        }
        .data-table td {
          padding: 0 !important;
          border: none !important;
        }
        .table-cell-actions {
          display: none !important;
        }
      `}</style>
    </div>
  );
};
