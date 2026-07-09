"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";

interface SelectItem {
  id: string;
  name: string;
}

interface SelectWithCursorProps {
  label?: string;
  placeholder?: string;
  items: SelectItem[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onSearch: (query: string) => void;
  onSelect: (item: SelectItem) => void;
  selectedId?: string;
  className?: string;
  disabled?: boolean;
}

export function SelectWithCursor({ label, placeholder = "Select an item...", items, isLoading, hasMore, onLoadMore, onSearch, onSelect, selectedId, className, disabled = false }: SelectWithCursorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const selectedItem = items.find((item) => item.id === selectedId);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle intersection for infinite scroll
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore, onLoadMore],
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleSelect = (item: SelectItem) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full space-y-1.5", className, isOpen && "z-20")} ref={containerRef}>
      {label && <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 bg-bg-elevated border border-border rounded-lg transition-all duration-200 text-left",
          "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          isOpen && "border-primary ring-2 ring-primary/20",
        )}
      >
        <span className={cn("text-sm truncate", !selectedItem && "text-text-muted")}>{selectedItem ? selectedItem.name : placeholder}</span>
        <Icon name="chevron-down" className={cn("text-xs text-text-muted transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute select-panel z-50 w-full mt-2 bg-bg-surface border border-border rounded-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
          <div className="p-2 border-b border-border bg-bg-elevated/50">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted" />
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-bg-elevated border border-border rounded-lg text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div ref={listRef} className="max-h-[240px] overflow-y-auto overflow-x-hidden custom-scrollbar py-1">
            {items.length === 0 && !isLoading ? (
              <div className="px-4 py-8 text-center text-sm text-text-muted">No items found</div>
            ) : (
              <>
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    ref={index === items.length - 1 ? (node) => lastElementRef(node) : null}
                    onClick={() => handleSelect(item)}
                    disabled={disabled}
                    className={cn("flex items-center w-full px-4 py-2.5 text-sm transition-colors duration-200", "hover:bg-bg-elevated", selectedId === item.id ? "bg-primary-dim text-primary" : "text-text-primary")}
                  >
                    <span className="flex-1 text-left truncate">{item.name}</span>
                    {selectedId === item.id && <Icon name="check" className="text-xs" />}
                  </button>
                ))}

                {isLoading && (
                  <div className="px-4 py-4 flex items-center justify-center gap-2 text-xs text-text-muted">
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Loading more...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
