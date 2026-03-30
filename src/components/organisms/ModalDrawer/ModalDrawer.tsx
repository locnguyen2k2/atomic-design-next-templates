'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';

type ModalMode = 'create' | 'view' | 'edit';
type ModalEntity = 'organization' | 'project' | 'feature' | 'role';

interface ModalDrawerProps {
  open: boolean;
  mode: ModalMode;
  entity: ModalEntity;
  data: Record<string, unknown> | null;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

export function ModalDrawer({
  open,
  mode,
  entity,
  data,
  onClose,
  onSave,
  onDelete,
  children,
}: ModalDrawerProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'metadata' | 'permissions'>('general');
  const [width, setWidth] = useState(480);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (mode !== 'view') onSave(data || {});
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, mode, data, onClose, onSave]);

  // Drag to resize
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!drawerRef.current) return;
      const newWidth = Math.min(800, Math.max(360, window.innerWidth - e.clientX));
      setWidth(newWidth);
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!open) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black/60 z-50" onClick={onClose}>
      <div
        ref={drawerRef}
        className={cn(
          'modal-drawer fixed right-0 top-0 h-full bg-bg-elevated border-l border-border',
          'transform transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ width: `${width}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div
          className="modal-drag-handle absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20"
          onMouseDown={() => setIsDragging(true)}
        />

        {/* Header */}
        <div className="modal-header flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Badge variant={mode === 'create' ? 'success' : mode === 'edit' ? 'warning' : 'primary'}>
              {mode.toUpperCase()}
            </Badge>
            <div>
              <h2 className="modal-title text-lg font-semibold">
                {mode === 'create' ? `Create ${entity}` : data?.name || entity}
              </h2>
              <p className="modal-subtitle text-sm text-text-muted">
                {mode === 'create' ? `Fill in details to create a new ${entity}` : data?.slug || ''}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="xmark" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs flex border-b border-border">
          {(['general', 'metadata'] as const).map((tab) => (
            <button
              key={tab}
              className={cn(
                'modal-tab px-4 py-3 text-sm font-medium border-b-2 -mb-px',
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          {entity === 'role' && (
            <button
              className={cn(
                'modal-tab px-4 py-3 text-sm font-medium border-b-2 -mb-px',
                activeTab === 'permissions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              )}
              onClick={() => setActiveTab('permissions')}
            >
              Permissions
            </button>
          )}
        </div>

        {/* Body */}
        <div className="modal-body flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Footer */}
        <div className="modal-footer flex items-center justify-end gap-3 p-4 border-t border-border">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {mode === 'edit' && onDelete && (
            <Button variant="danger" onClick={onDelete}>
              <Icon name="trash" /> Delete
            </Button>
          )}
          {mode !== 'view' && (
            <Button onClick={() => onSave(data || {})} disabled={mode === 'view'}>
              {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
