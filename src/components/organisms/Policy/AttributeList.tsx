import { Attribute } from "@/types/abac";
import { Card } from "@/components/atoms/Card";
import { Icon } from "@/components/atoms/Icon";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { SearchForm } from "@/components/molecules/SearchForm";
import { DateRangePicker } from "@/components/atoms/DateRangePicker";
import { Pagination } from "@/components/molecules/Pagination";

interface AttributeListProps {
  subjectAttributes: Attribute[];
  resourceAttributes: Attribute[];
  environmentAttributes: Attribute[];
  isLoading?: boolean;
  search?: string;
  onSearch?: (query: string) => void;
  dateRange?: { from?: Date; to?: Date };
  onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
  onSort?: (field: string, order: "asc" | "desc") => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange?: (page: number) => void;
}

export const AttributeList: React.FC<AttributeListProps> = ({ 
  subjectAttributes, 
  resourceAttributes, 
  environmentAttributes,
  isLoading,
  search,
  onSearch,
  dateRange,
  onDateRangeChange,
  onSort,
  pagination,
  onPageChange
}) => {
  const columns = [
    {
      key: "key",
      label: "Key",
      sortable: true,
      render: (attr: Attribute) => (
        <div className="abac-attr-name flex items-center gap-1.5">
          <code className="abac-code px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-primary font-mono text-[11px] font-bold">{attr.key}</code>
        </div>
      )
    },
    { key: "label", label: "Label", sortable: true },
    {
      key: "data_type",
      label: "Type",
      sortable: true,
      render: (attr: Attribute) => (
        <span
          className={cn(
            "abac-type-badge inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border",
            attr.data_type === "STRING" && "abac-type-badge--string bg-warning/10 text-warning border-warning/20",
            attr.data_type === "BOOLEAN" && "abac-type-badge--boolean bg-success/10 text-success border-success/20",
            attr.data_type === "NUMBER" && "abac-type-badge--number bg-violet/10 text-violet border-violet/20",
          )}
        >
          {attr.data_type}
        </span>
      )
    },
    {
      key: "entity_type",
      label: "Entity Type",
      sortable: true,
      render: (attr: Attribute) => (
        <code className="abac-code px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-text-secondary font-mono text-[10px] font-bold">
          {attr.entity_type}
        </code>
      )
    },
    { key: "description", label: "Description", render: (attr: Attribute) => <span className="text-xs text-text-secondary max-w-[200px] truncate block">{attr.description}</span> },
  ];

  const renderAttributeGroup = (title: string, attrs: Attribute[], color: string, icon: any, isLast: boolean = false) => {
    return (
      <Card className="overflow-hidden mb-6">
        <Card.Header className="flex flex-row items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", `bg-${color}/10 text-${color}`)}>
              <Icon name={icon} size="sm" />
            </div>
            <div>
              <Card.Title className="text-base font-bold">{title} Attributes</Card.Title>
              <Card.Subtitle className="text-xs text-text-muted mt-0.5">Manage {title.toLowerCase()} attributes for policy rules</Card.Subtitle>
            </div>
          </div>
          <Button size="sm" className="h-8 text-xs font-bold gap-1.5">
            <Icon name="plus" size={"md"} /> Add Attribute
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          <DataTable
            data={attrs}
            columns={columns}
            keyField="id"
            isLoading={isLoading}
            onSort={onSort}
            onEdit={(attr) => console.log("Edit", attr)}
            onDelete={(attr) => console.log("Delete", attr)}
          />
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-1 items-center gap-4">
          {onSearch && (
            <SearchForm
              placeholder="Search attributes..."
              onSearch={onSearch}
            />
          )}
          {onDateRangeChange && (
            <DateRangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              label="Date Range"
              className="min-w-[300px]"
            />
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-muted">
            {pagination?.totalItems ?? 0} attributes
          </span>
          {pagination && onPageChange && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>

      <div className="abac-attribute-groups animate-slide-up">
        {renderAttributeGroup("Subject", subjectAttributes, "primary", "user-tag")}
        {renderAttributeGroup("Resource", resourceAttributes, "accent", "database")}
        {renderAttributeGroup("Environment", environmentAttributes, "warning", "clock")}
      </div>
    </div>
  );
};
