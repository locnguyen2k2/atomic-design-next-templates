'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';

type ModalMode = 'create' | 'view' | 'edit';
type ModalEntity = 'organization' | 'project' | 'feature' | 'role' | 'policy';

interface ModalDrawerProps {
  open: boolean;
  mode: ModalMode;
  entity: ModalEntity;
  data: Record<string, unknown> | null;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  onDelete?: () => void;
  children: React.ReactNode | ((props: { activeTab: string }) => React.ReactNode);
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
  const [activeTab, setActiveTab] = useState<'general' | 'recent_activity' | 'permissions'>('general');
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
  <div className={cn("modal-overlay", open && "open")} onClick={onClose}>
    <div
      ref={drawerRef}
      className="modal-drawer"
      style={{ width: `${width}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drag Handle */}
      <div
        className="modal-drag-handle"
        onMouseDown={() => setIsDragging(true)}
      >
        <div className="modal-drag-bar"></div>
      </div>

      {/* Header */}
      <div className="modal-header">
        <div className="modal-header-left">
          <span className={cn(
            "modal-mode-badge",
            mode === 'create' ? 'mode-create' : 
            mode === 'edit' ? 'mode-edit' : 'mode-view'
          )}>
            {mode.toUpperCase()}
          </span>
          <div>
            <h2 className="modal-title">
              {mode === 'create' ? `Create ${entity}` : data?.name ? String(data.name) : JSON.stringify(entity)}
            </h2>
            <p className="modal-subtitle">
              {mode === 'create' ? 'Fill in details to create a new entity' : 'Edit entity details'}
            </p>
          </div>
        </div>
        <button className="modal-close" onClick={onClose}>
          <Icon name="xmark" />
        </button>
      </div>

      {/* Tabs */}
      <div className="modal-tabs">
        <button
          className={cn(
            'modal-tab',
            activeTab === 'general' && 'active'
          )}
          onClick={() => setActiveTab('general')}
        >
          <Icon name="circle-info" /> General
        </button>
        <button
          className={cn(
            'modal-tab',
            activeTab === 'recent_activity' && 'active'
          )}
          onClick={() => setActiveTab('recent_activity')}
        >
          <Icon name="history" /> Recent Activity
        </button>
        {entity === 'role' && (
          <button
            className={cn(
              'modal-tab',
              activeTab === 'permissions' && 'active'
            )}
            onClick={() => setActiveTab('permissions')}
          >
            <Icon name="key" /> Permissions
          </button>
        )}
      </div>

      {/* Body */}
      <div className="modal-body">
        {typeof children === 'function' ? children({ activeTab }) : children}
      </div>

      {/* Footer */}
      <div className="modal-footer">
        <div className="modal-footer-left">
          {mode === 'edit' && onDelete && (
            <button className="modal-btn-danger" onClick={onDelete}>
              <Icon name="trash" /> Delete
            </button>
          )}
        </div>
        <div className="modal-footer-right">
          <button className="modal-btn-secondary" onClick={onClose}>
            <Icon name="xmark" /> Cancel
          </button>
          {mode !== 'view' && (
            <button className="modal-btn-primary" onClick={() => onSave(data || {})}>
              <Icon name="check" /> {mode === 'create' ? 'Create' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
