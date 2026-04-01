'use client';

import { useState, useCallback } from 'react';
import { Icon } from '@/components/atoms/Icon';

interface SearchFormProps {
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export function SearchForm({ 
  id,
  placeholder = 'Search...', 
  defaultValue = '',
  onSearch,
  debounceMs = 300,
}: SearchFormProps) {
  const [value, setValue] = useState(defaultValue);

  const debouncedSearch = useCallback(
    debounce((val: string) => onSearch(val), debounceMs),
    [onSearch, debounceMs]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="toolbar-search relative">
      <Icon 
        name="search" 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="toolbar-search-input w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-2 text-sm"
      />
    </div>
  );
}

function debounce<T extends (...args: any[]) => void>(
  fn: T, 
  ms: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}
