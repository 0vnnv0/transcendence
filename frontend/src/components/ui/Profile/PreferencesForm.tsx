import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useUpdateProfile } from '../../../hooks/useUsers'
import Button from '../Button/Button'
import Toggle from '../Toggle/Toggle'
import MultiSelect from '../Multiselect/Multiselect'
import CardSection from '../../sections/CardSection'
import InfoCard from '../Cards/InfoCard'
import { formatAvailability } from '../../../utils/formatAvailability'

type ProfileFormValues = {
	days: string[];
	location: 'campus' | 'remote';
};

interface PreferencesFormProps {
	profile: any;
	userId: number;
	userName: string;
}

const DAY_OPTIONS = [
	{ label: "Mon", value: "Mon" },
	{ label: "Tue", value: "Tue" },
	{ label: "Wed", value: "Wed" },
	{ label: "Thu", value: "Thurs" },
	{ label: "Fri", value: "Fri" },
	{ label: "Sat", value: "Sat" },
	{ label: "Sun", value: "Sun" },
];

const LOCATION_OPTIONS = [
	{ value: 'campus' as const, label: 'Campus' },
	{ value: 'remote' as const, label: 'Remote' },
];

function PreferencesForm({ profile, userId, userName }: PreferencesFormProps) {
	const { handleSubmit, control, reset, formState: { errors } } = useForm<ProfileFormValues>({
		defaultValues: { days: [], location: 'campus' },
	});

	const { mutate, isPending } = useUpdateProfile(userId, userName);

	const [isEditing, setIsEditing] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// Sync form with server data once it arrives — Controller's defaultValue
	// only applies on first mount, so this is what actually populates the fields
	// once the profile query resolves.
	useEffect(() => {
		if (!profile) return;
			reset({
				days: profile.availability?.preferredDays?.length
					? profile.availability.preferredDays   // <-- use saved data if it exists
					: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"], // <-- fallback only if empty/missing
				location: profile.availability?.isRemote ? 'remote' : 'campus',
			});
	}, [profile, reset]);

	// No saved days yet -> treat as "no data", form starts active/editable.
	const hasSavedData = (profile?.availability?.preferredDays?.length ?? 0) > 0;
	// Disabled only in "view mode": not currently editing AND there's already
	// saved data to show. If nothing's saved, it's always active.

	const updateUserData = (formData: ProfileFormValues) => {
		mutate(
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
		<>
			{(!hasSavedData || isEditing) ? (
				<div>
					<h2 className="text-lead mb-2">Your availability</h2>
					<div className="p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
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
											/>
										)}
									/>
								</div>
							</div>
							<Button
								type="submit"
								size='sm'
							>
								{isPending ? 'Saving...' : 'Save changes'}
							</Button>
						</form>
						{errors.days && <p className="text-red-500 text-xs mt-1">{String(errors.days.message)}</p>}
						{errorMsg && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
					</div>
				</div>
			) : (
				<div className="relative group">
					<Button
						className="absolute z-10 top-10 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
						size="sm"
						variant="secondary"
						icon="edit"
						onClick={() => setIsEditing(true)}
					>Edit</Button>
					<CardSection title="User Info">
						<CardSection.Body viewMode="grid" columns="none">
							{profile?.availability?.preferredDays &&
								<InfoCard icon="flame" title="Weekdays" description={formatAvailability(profile?.availability?.preferredDays)} />
							}
							{profile?.availability?.workDaysPerWeek &&
								<InfoCard icon="calendar" title="Days per week" description={profile?.availability?.workDaysPerWeek as unknown as string} />
							}
							<InfoCard icon="home" title="Location" description={profile?.availability?.isRemote ? 'Remote' : 'On Campus'} />
							{/* <InfoCard icon="trophy" title="Rank" description={`${profile?.currentRank}`} /> */}
							{/* <InfoCard icon="smiley" title="Coalition" description={`${profile?.coalitionName}`} /> */}
						</CardSection.Body>
					</CardSection>
				</div>
			)}
	</>)
}

export default PreferencesForm;
