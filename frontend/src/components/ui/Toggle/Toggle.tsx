import Option from '../Options/Options';
import type { CustomIconName } from '../Icon/CustomIcons';

// Toggle.tsx
interface ToggleOption<T extends string> {
  value: T;
  label?: string;
  icon?: CustomIconName;
  ariaLabel?: string;
}

interface ToggleProps<T extends string> {
  options: readonly ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function Toggle<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
}: ToggleProps<T>) {
  return (
	<div className="flex flex-col gap-1">
		<p className="text-tag-bold">Show</p>
		<div className={`inline-flex gap-0.5 w-min bg-background-dark rounded-lg p-0.75 ${className}`}>
			{options.map((option) => (
				<Option
					key={option.value}
					label={option.label}
					icon={option.icon}
					size={size}
					selected={value === option.value}
					disabled={disabled}
					onClick={() => onChange(option.value)}
					aria-label={option.ariaLabel ?? option.label}
				/>
			))}
		</div>
	</div>
  );
}

export default Toggle;
