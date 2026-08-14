// components/profile/AvatarUpload.tsx
import { useRef } from 'react'
import { useUpdateAvatar } from '../../../hooks/useUsers';
import Button from '../Button/Button'

interface AvatarUploadProps {
	avatarUrl?: string;
	userKey: string | null;
}

function AvatarUpload({ avatarUrl, userKey }: AvatarUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const updateAvatar = useUpdateAvatar(userKey);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		updateAvatar.mutate(file);
		e.target.value = '';
	}

	return (
		<div className="group relative h-50 w-50 rounded-3xl bg-cover bg-center bg-no-repeat overflow-hidden"
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
