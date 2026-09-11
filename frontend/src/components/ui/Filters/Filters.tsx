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

  return (
    <div className="flex flex-col w-full sm:justify-between lg:justify-end lg:w-min sm:flex-row gap-2 sm:gap-4">
      <MultiSelect options={DAY_OPTIONS} value={days} onChange={setDays} />
      <Toggle value={viewMode} onChange={setViewMode} options={VIEW_MODE_OPTIONS} />
    </div>
  );
}

export default ProjectFilters;
