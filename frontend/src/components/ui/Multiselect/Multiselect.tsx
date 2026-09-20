import React from 'react';
import Option from '../Options/Options';

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[] | undefined;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean,
  className?: string;
  type?: string;
}

// Controlled multiselect: parent owns the selected values array (value/onChange),
// same pattern as a native input so it plugs straight into react-hook-form's Controller.
const MultiSelect: React.FC<MultiSelectProps> = ({ options, value, onChange, disabled = false, type, className = '' }) => {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
	<div className="flex flex-col gap-1">
		<p className="text-tag-bold">{type}</p>
		<div className={`flex gap-0.5 bg-background-dark rounded-lg p-0.75 ${className}`}>
		{options?.map((option) => (
			<Option
			key={option.value}
			label={option.label}
			disabled={disabled}
			selected={value.includes(option.value)}
			onClick={() => toggleOption(option.value)}
			/>
		))}
		</div>
	</div>
  );
};

export default MultiSelect;
