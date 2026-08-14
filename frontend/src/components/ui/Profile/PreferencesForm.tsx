import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useUpdateProfile } from '../../../hooks/useUsers'
import Button from '../Button/Button'
import Toggle from '../Toggle/Toggle'
import MultiSelect from '../Multiselect/Multiselect'

type ProfileFormValues = {
	days: string[];
	location: 'campus' | 'remote';
};

interface PreferencesFormProps {
	profile: any;
	userName: string;
}

const DAY_OPTIONS = [
	{ label: "Mon", value: "monday" },
	{ label: "Tue", value: "tuesday" },
	{ label: "Wed", value: "wednesday" },
	{ label: "Thu", value: "thursday" },
	{ label: "Fri", value: "friday" },
	{ label: "Sat", value: "saturday" },
	{ label: "Sun", value: "sunday" },
];

const LOCATION_OPTIONS = [
	{ value: 'campus' as const, label: 'Campus' },
	{ value: 'remote' as const, label: 'Remote' },
];

function PreferencesForm({ profile, userName }: PreferencesFormProps) {
	const { handleSubmit, control, reset, formState: { errors } } = useForm<ProfileFormValues>({
		defaultValues: { days: [], location: 'campus' },
	});
	const updateProfileMutation = useUpdateProfile(userName);

	const [isEditing, setIsEditing] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// Sync form with server data once it arrives — Controller's defaultValue
	// only applies on first mount, so this is what actually populates the fields
	// once the profile query resolves.
	useEffect(() => {
		if (!profile) return;
		reset({
			days: profile.preferredDays ?? [],
			location: profile.isRemote ? 'remote' : 'campus',
		});
	}, [profile, reset]);

	// No saved days yet -> treat as "no data", form starts active/editable.
	const hasSavedData = (profile?.preferredDays?.length ?? 0) > 0;

	// Disabled only in "view mode": not currently editing AND there's already
	// saved data to show. If nothing's saved, it's always active.
	const isDisabled = hasSavedData && !isEditing;

	const updateUserData = (formData: ProfileFormValues) => {
		updateProfileMutation.mutate(
			{
				days: formData.days,
				location: formData.location,
			},
			{
				onSuccess: () => {
					setIsEditing(false);
					setErrorMsg(null);
				},
				onError: (error) => {
					setErrorMsg(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
				},
			}
		);
	};

	return (
		<div>
			<h2 className="text-lead mb-2">Your availability</h2>
			<div className="group relative p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">

				{!isEditing && hasSavedData && (
					<Button
						className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
						size="sm"
						variant="secondary"
						icon="edit"
						onClick={() => setIsEditing(true)}
					>Edit</Button>
				)}

				<form
					onSubmit={handleSubmit(updateUserData)}
					className="flex flex-row justify-between"
				>
					<div className="flex flex-row gap-6">
						<div>
							<label className="text-black block text-xs font-medium mb-2">Days per week</label>
							<Controller
								name="days"
								control={control}
								rules={{ validate: (value) => value.length > 0 || "Select at least one day" }}
								render={({ field: { value, onChange } }) => (
									<MultiSelect
										options={DAY_OPTIONS}
										value={value}
										onChange={onChange}
										disabled={isDisabled}
									/>
								)}
							/>
						</div>

						<div>
							<label className="text-black block text-xs font-medium mb-2">Working from</label>
							<Controller
								name="location"
								control={control}
								render={({ field: { value, onChange } }) => (
									<Toggle
										value={value}
										onChange={onChange}
										options={LOCATION_OPTIONS}
										disabled={isDisabled}
									/>
								)}
							/>
						</div>
					</div>

					{(isEditing || !hasSavedData) && (
						<div className="flex flex-col items-end gap-2 h-min self-end">
							<div className="flex gap-2">
								{isEditing && hasSavedData && (
									<Button
										type="button"
										variant="secondary"
										size='sm'
										onClick={() => {
											reset({
												days: profile?.preferredDays ?? [],
												location: profile?.isRemote ? 'remote' : 'campus',
											});
											setErrorMsg(null);
											setIsEditing(false);
										}}
									>Cancel</Button>
								)}
								<Button
									type="submit"
									size='sm'
									disabled={updateProfileMutation.isPending}
								>
									{updateProfileMutation.isPending ? 'Saving...' : 'Save changes'}
								</Button>
							</div>
						</div>
					)}
				</form>
				{errors.days && <p className="text-red-500 text-xs mt-1">{String(errors.days.message)}</p>}
				{errorMsg && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
			</div>
		</div>
	);
}

export default PreferencesForm;
