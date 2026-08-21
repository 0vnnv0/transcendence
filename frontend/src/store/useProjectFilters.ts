import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ViewMode = 'grid' | 'list';

interface ProjectFiltersState {
  viewMode: ViewMode;
  days: string[];
  setViewMode: (viewMode: ViewMode) => void;
  setDays: (days: string[]) => void;
}
export const useProjectFilters = create<ProjectFiltersState>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      days: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri'],
      setViewMode: (viewMode) => set({ viewMode }),
      setDays: (days) => set({ days }),
    }),
    {
      name: 'project-filters',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
