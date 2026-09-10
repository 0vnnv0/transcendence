// components/profile/AvatarUpload.tsx
import { useRef, useState } from 'react'
import { useUploadAvatar } from '../../../hooks/useUsers';
import Button from '../Button/Button'

interface AvatarUploadProps {
	login: string;
	avatarUrl: string;
	userId: number;
}

function AvatarUpload({ avatarUrl, userId, login }: AvatarUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { mutate: uploadAvatar, isPending } = useUploadAvatar(userId, login);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		uploadAvatar(file);

		e.target.value = '';
	}
	return (
		<div className="group relative border border-black h-50 w-50 rounded-3xl bg-cover bg-center bg-no-repeat overflow-hidden"
			style={{ backgroundImage: `url(${avatarUrl})` }}>
			<Button
				className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
				size="sm"
				variant="secondary"
				icon="edit"
				onClick={() => fileInputRef.current?.click()}
			>Edit</Button>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleFileChange}
			/>
		</div>
	);
}

export default AvatarUpload;
