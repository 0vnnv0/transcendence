import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ViewMode = 'grid' | 'list';

interface ProjectFiltersState {
  viewMode: ViewMode;
  days: string[];
  rank: string[];
  setViewMode: (viewMode: ViewMode) => void;
  setDays: (days: string[]) => void;
  setRank: (rank: string[]) => void;
}
export const useProjectFilters = create<ProjectFiltersState>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      days: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri'],
	  rank: ['Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5', 'Rank 6'],
      setViewMode: (viewMode) => set({ viewMode }),
      setDays: (days) => set({ days }),
	  setRank: (rank) => set({ rank }),
    }),
    {
      name: 'project-filters',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
