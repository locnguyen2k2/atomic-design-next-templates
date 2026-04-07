'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/organisms/DataTable';
import { ModalDrawer } from '@/components/organisms/ModalDrawer';
import { Icon } from '@/components/atoms/Icon';
import { useAppStore } from '@/stores';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  type?: 'text' | 'slug' | 'date' | 'org' | 'desc';
}

interface ListPageTemplateProps<T> {
  title: string;
  subtitle: string;
  icon: Parameters<typeof import('@/components/atoms/Icon').Icon>[0]['name'];
  color: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'violet';
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  isLoading?: boolean;
  renderForm?: (props: any) => React.ReactNode;
  onCreate?: (data: T) => void;
  onUpdate?: (id: string, data: Partial<T>) => void;
  onDelete?: (id: string) => void;
  filters?: React.ReactNode;
  enableDateRangeFilter?: boolean;
  dateRangeFilterLabel?: string;
  dateField?: keyof T;
  onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
  dateRangeFilterValue?: { from?: Date; to?: Date };
  onSearch?: (query: string) => void;
  emptyState?: {
    icon: Parameters<typeof import('@/components/atoms/Icon').Icon>[0]['name'];
    title: string;
    message: string;
  };
}

export function ListPageTemplate<T extends Record<string, unknown>>({
  title,
  subtitle,
  icon,
  color,
  data,
  columns,
  keyField,
  isLoading,
  renderForm,
  onCreate,
  onUpdate,
  onDelete,
  filters,
  enableDateRangeFilter,
  dateRangeFilterLabel,
  dateField,
  onDateRangeChange,
  dateRangeFilterValue,
  onSearch,
  emptyState,
}: ListPageTemplateProps<T>) {
  const { modalOpen, modalMode, modalEntity, modalData, openModal, closeModal, addToast } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const handleSearch = onSearch || ((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  });

  const handleDateRangeChange = onDateRangeChange || ((range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    setCurrentPage(1);
  });

  const currentSearchQuery = onSearch ? '' : searchQuery;
  const currentDateRange = onDateRangeChange ? dateRangeFilterValue || {} : dateRange;

  const filteredData = data.filter((item) => {
    if (onSearch && onDateRangeChange) {
      return true; 
    }

    // Search filter
    const matchesSearch = Object.values(item).some(
      (value) =>
        typeof value === 'string' &&
        value.toLowerCase().includes(currentSearchQuery.toLowerCase())
    );

    // Date range filter
    let matchesDateRange = true;
    if (enableDateRangeFilter && dateField) {
      const itemDate = item[dateField];
      if (itemDate instanceof Date) {
        matchesDateRange = (!currentDateRange.from || itemDate >= currentDateRange.from) &&
          (!currentDateRange.to || itemDate <= currentDateRange.to);
      } else if (typeof itemDate === 'string') {
        const parsedDate = new Date(itemDate);
        if (!isNaN(parsedDate.getTime())) {
          matchesDateRange = (!currentDateRange.from || parsedDate >= currentDateRange.from) &&
            (!currentDateRange.to || parsedDate <= currentDateRange.to);
        }
      }
    }

    return matchesSearch && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    openModal('create', modalEntity || 'organization');
  };

  const handleView = (row: T) => {
    console.log('Viewing row:', row);
    openModal('view', modalEntity || 'organization', row);
  };

  const handleEdit = (row: T) => {
    console.log('Editing row:', row);
    openModal('edit', modalEntity || 'organization', row);
  };

  const handleDelete = (row: T) => {
    if (onDelete && confirm('Are you sure you want to delete this item?')) {
      onDelete(String(row[keyField as string]));
      addToast({ message: 'Item deleted successfully', type: 'success' });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSave = (data: Record<string, unknown>) => {
    if (modalMode === 'create' && onCreate) {
      onCreate(data as T);
      addToast({ message: 'Item created successfully', type: 'success' });
    } else if (modalMode === 'edit' && modalData && onUpdate) {
      onUpdate(String((modalData as T)[keyField]), data as Partial<T>);
      addToast({ message: 'Item updated successfully', type: 'success' });
    }
    closeModal();
  };

  const handleDeleteFromModal = () => {
    if (modalData && onDelete) {
      onDelete(String((modalData as T)[keyField]));
      addToast({ message: 'Item deleted successfully', type: 'success' });
      closeModal();
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header flex items-start justify-between mb-6">
        <div className="page-header-info">
          <h1 className="page-title flex items-center gap-3 text-2xl font-bold">
            <Icon name={icon} className={`text-${color}`} />
            {title}
          </h1>
          <p className="page-subtitle text-text-muted mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={paginatedData}
        columns={columns}
        keyField={keyField}
        isLoading={isLoading}
        searchPlaceholder={`Search ${title.toLowerCase()}...`}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onCreate={handleCreate}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
        enableDateRangeFilter={enableDateRangeFilter}
        onDateRangeChange={handleDateRangeChange}
        dateRangeFilterValue={currentDateRange}
        dateRangeFilterLabel={dateRangeFilterLabel}
        pagination={{
          currentPage,
          totalPages,
          totalItems: filteredData.length,
          itemsPerPage,
        }}
        emptyState={emptyState}
      />

      {/* Modal Drawer */}
      <ModalDrawer
        open={modalOpen}
        mode={modalMode}
        entity={modalEntity || 'organization'}
        data={modalData}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDeleteFromModal}
      >
        {({ activeTab }) => renderForm && renderForm({ data: modalData, mode: modalMode, activeTab })}
      </ModalDrawer>
    </>
  );
}
