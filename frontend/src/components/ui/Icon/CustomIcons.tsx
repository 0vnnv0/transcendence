import React from 'react';

type AllowedIconSizes = 16 | 24;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: AllowedIconSizes;
}

const Smiley = ({ size = 16, ...props }: IconProps) => (
	<svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M5.46799 9.46152C5.97341 10.3352 6.91806 10.9231 8.00002 10.9231C9.10056 10.9231 10.0591 10.3148 10.5577 9.41621M6.61868 6.61563C6.61868 6.7537 6.50675 6.86563 6.36868 6.86563C6.23061 6.86563 6.11868 6.7537 6.11868 6.61563C6.11868 6.47755 6.23061 6.36563 6.36868 6.36563C6.50675 6.36563 6.61868 6.47755 6.61868 6.61563ZM9.90707 6.61563C9.90707 6.7537 9.79514 6.86563 9.65707 6.86563C9.519 6.86563 9.40707 6.7537 9.40707 6.61563C9.40707 6.47755 9.519 6.36563 9.65707 6.36563C9.79514 6.36563 9.90707 6.47755 9.90707 6.61563ZM12.75 8C12.75 10.6234 10.6234 12.75 8 12.75C5.37665 12.75 3.25 10.6234 3.25 8C3.25 5.37665 5.37665 3.25 8 3.25C10.6234 3.25 12.75 5.37665 12.75 8Z" stroke="white" stroke-linecap="round"/>
	</svg>
);

const Edit = ({ size = 16, ...props }: IconProps) => (
	<svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M4.47668 10.4693L3.77569 11.171C3.48533 11.4617 3.48533 11.933 3.77569 12.2237C4.06605 12.5144 4.53681 12.5144 4.82717 12.2237L5.52816 11.5219M10.0846 5.90791L8.15688 7.83773M6.40439 12.0592L12.0232 6.43424C12.7007 5.756 12.7007 4.65635 12.0232 3.97811C11.3457 3.29986 10.2473 3.29986 9.56978 3.9781L3.95094 9.6031L6.40439 12.0592Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>
);

const Message = ({ size = 16, ...props }: IconProps) => (
	<svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg {...props}">
		<path d="M3.25 6.41661L7.4453 3.61973C7.7812 3.3958 8.2188 3.3958 8.5547 3.61973L12.75 6.4166V11.7499C12.75 12.3022 12.3023 12.7499 11.75 12.7499H4.25C3.69772 12.7499 3.25 12.3022 3.25 11.7499L3.25 6.41661ZM12.75 6.4166L9.22788 9.15602C8.50566 9.71775 7.49434 9.71775 6.77212 9.15602L3.25 6.41661" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>
);

// This object acts as your master lookup dictionary
export const CustomIcons = {
  smiley: Smiley,
  edit: Edit,
  message: Message,
  // Add your remaining icons here...
};

export type CustomIconName = keyof typeof CustomIcons;
