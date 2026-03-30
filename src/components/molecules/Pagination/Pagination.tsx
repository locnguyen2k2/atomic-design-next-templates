'use client';

import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 2 || i >= totalPages - 1 || Math.abs(i - currentPage) <= 1) {
        pages.push(i);
      } else if (i === 3 || i === totalPages - 2) {
        pages.push('ellipsis');
      }
    }
    return pages;
  };

  return (
    <div className="pagination flex items-center justify-between py-4">
      <div className="pagination-info text-sm text-text-muted">
        Showing {startItem}–{endItem} of {totalItems}
      </div>
      
      <div className="pagination-controls flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon name="chevron-left" />
        </Button>

        {getPageNumbers().map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-text-muted">…</span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Icon name="chevron-right" />
        </Button>
      </div>
    </div>
  );
}
