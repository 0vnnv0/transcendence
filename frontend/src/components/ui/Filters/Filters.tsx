// components/ui/Filters/ProjectFilters.tsx
import { useProjectFilters } from '../../../store/useProjectFilters';
import Toggle from '../Toggle/Toggle';
import MultiSelect from '../Multiselect/Multiselect';

const DAY_OPTIONS = [
	{ label: "Mon", value: "Mon" },
	{ label: "Tue", value: "Tue" },
	{ label: "Wed", value: "Wed" },
	{ label: "Thu", value: "Thurs" },
	{ label: "Fri", value: "Fri" },
	{ label: "Sat", value: "Sat" },
	{ label: "Sun", value: "Sun" },
];

const RANK_OPTIONS = [
	{ label: "1", value: "Rank 1" },
	{ label: "2", value: "Rank 2" },
	{ label: "3", value: "Rank 3" },
	{ label: "4", value: "Rank 4" },
	{ label: "5", value: "Rank 5" },
	{ label: "6", value: "Rank 6" },
];

const VIEW_MODE_OPTIONS = [
  { value: 'grid', icon: 'grid', ariaLabel: 'Grid view' },
  { value: 'list', icon: 'list', ariaLabel: 'List view' },
] as const;

function ProjectFilters() {
  // selective subscriptions — each component only re-renders when its own slice changes
  const viewMode = useProjectFilters((s) => s.viewMode);
  const setViewMode = useProjectFilters((s) => s.setViewMode);
  const days = useProjectFilters((s) => s.days);
  const setDays = useProjectFilters((s) => s.setDays);
  const rank = useProjectFilters((s) => s.rank);
  const setRank = useProjectFilters((s) => s.setRank);

  return (
    <div className="flex flex-col w-full sm:justify-between lg:justify-end lg:w-min sm:flex-row gap-2 sm:gap-4">
      <MultiSelect options={DAY_OPTIONS} value={days} onChange={setDays} />
	  <MultiSelect options={RANK_OPTIONS} value={rank} onChange={setRank} />
      <Toggle value={viewMode} onChange={setViewMode} options={VIEW_MODE_OPTIONS} />
    </div>
  );
}

export default ProjectFilters;
