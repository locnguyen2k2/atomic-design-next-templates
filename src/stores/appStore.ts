import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  currentOrg: string;
  setCurrentOrg: (orgId: string) => void;

  currentProject: string;
  setCurrentProject: (projectId: string) => void;

  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;

  modalOpen: boolean;
  modalMode: 'create' | 'view' | 'edit';
  modalEntity: 'organization' | 'project' | 'feature' | 'role' | null;
  modalData: Record<string, unknown> | null;
  openModal: (mode: 'create' | 'view' | 'edit', entity: string, data?: Record<string, unknown>) => void;
  updateModalData: (data: Record<string, unknown>) => void;
  closeModal: () => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      currentOrg: '',
      setCurrentOrg: (orgId) => {
        console.log(orgId);
        set({ currentOrg: orgId });
      },

      currentProject: '',
      setCurrentProject: (projectId) => set({ currentProject: projectId }),

      toasts: [],
      addToast: (toast) => set((state) => ({
        toasts: [...state.toasts, { ...toast, id: generateId() }],
      })),
      dismissToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),

      modalOpen: false,
      modalMode: 'create',
      modalEntity: null,
      modalData: null,
      openModal: (mode, entity, data) => set({
        modalOpen: true,
        modalMode: mode,
        modalEntity: entity as AppState['modalEntity'],
        modalData: data || null,
      }),
      updateModalData: (data) => set((state) => ({
        modalData: state.modalData ? { ...state.modalData, ...data } : data,
      })),
      closeModal: () => set({
        modalOpen: false,
        modalMode: 'create',
        modalEntity: null,
        modalData: null,
      }),
    }),
    {
      name: 'nexusiam-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        currentOrg: state.currentOrg,
        currentProject: state.currentProject,
      }),
    }
  )
);
